class EventDeleteHandler {
  constructor(uPortMgr, eventMgr) {
    this.uPortMgr = uPortMgr;
    this.eventMgr = eventMgr;
  }

  async handle(event, context, cb) {
    //Check if headers are there
    if (!event.headers) {
      cb({ code: 403, message: "no headers" });
      return;
    }
    
    //Check if Authorization header is there
    if (!event.headers["Authorization"]) {
      cb({ code: 403, message: "no authorization header" });
      return;
    }
    
    //Parsing Authorization header
    let authHead = event.headers["Authorization"];

    let parts = authHead.split(" ");
    if (parts.length !== 2) {
      cb({ code: 401, message: "Format is Authorization: Bearer [token]" });
      return;
    }
    let scheme = parts[0];
    if (scheme !== "Bearer") {
      cb({ code: 401, message: "Format is Authorization: Bearer [token]" });
      return;
    }

    //Check token signature
    let payload;
    try {
      let dtoken = await this.uPortMgr.verifyToken(parts[1]);
      payload = dtoken.payload;
    } catch (error) {
      console.log("Error on this.uportMgr.verifyToken");
      console.log(error);
      cb({ code: 401, message: "Invalid token" });
      return;
    }

    let mnid = payload.iss;

    //Check if retrieving one event or multiple
    if (event.pathParameters && event.pathParameters.id) {
      let eventId;
      let evt;
      eventId = event.pathParameters.id;
      try {
        evt = await this.eventMgr.delete(mnid, eventId);
        cb(null);
        return;
      } catch (error) {
        console.log("Error on this.eventMgr.delete");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }
    } else {
      //Delete all
      try {
        await this.eventMgr.delete(mnid);
        cb(null);
        return;
      } catch (error) {
        console.log("Error on this.eventMgr.delete");
        console.log(error);
        cb({ code: 500, message: error.message });
        return;
      }
    }
  }
}

module.exports = EventDeleteHandler;
