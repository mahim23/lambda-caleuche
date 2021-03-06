const UportMgr = require("../uPortMgr");

describe("UportMgr", () => {
  let sut;
  let jwts = {
    legacy:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJpc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImlhdCI6MTUxMzM1MjgzNCwiZXZlbnQiOnsidHlwZSI6IlNUT1JFX0NPTk5FQ1RJT04iLCJhZGRyZXNzIjoiMm96c0ZRV0FVN0NwSFpMcXUyd1NZYkpGV3pETkIyNmFvQ0YiLCJjb25uZWN0aW9uVHlwZSI6ImNvbnRyYWN0cyIsImNvbm5lY3Rpb24iOiIweDJjYzMxOTEyYjJiMGYzMDc1YTg3YjM2NDA5MjNkNDVhMjZjZWYzZWUifSwiZXhwIjoxNTEzNDM5MjM0fQ.tqX5eEuaTEyYPUSgatK5zEsj_WpE-dIEHDc4ItpOvAZuBkSyV9_zbb0puNtDrZTVA7MlZ43FSSpf9CGIUxup-w",
    ethr:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1MTMzOTkyODAsImV2ZW50Ijp7InR5cGUiOiJBRERfQ09OTkVDVElPTiIsImFkZHJlc3MiOiIyb3pzRlFXQVU3Q3BIWkxxdTJ3U1liSkZXekROQjI2YW9DRiIsImNvbm5lY3Rpb25UeXBlIjoiY29udHJhY3RzIiwiY29ubmVjdGlvbiI6IjB4MmNjMzE5MTJiMmIwZjMwNzVhODdiMzY0MDkyM2Q0NWEyNmNlZjNlZSJ9LCJpc3MiOiJkaWQ6ZXRocjoweDhlNWE0OWQ5ZTViYWMxODE2OTM2MGY5N2RkODlkYjRjNWQ3YTExYTEifQ.spHf-o3mNGO_YzjEd65CPN4As-LwBGnGJLJY5ugzzVDLEEeUZEUKEVRAEhWVktINnHjsMsxSS31XvJCMhdg0JAA"
  };
  beforeAll(() => {
    sut = new UportMgr();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  test("empty constructor", () => {
    expect(sut).not.toBeUndefined();
  });

  test("verifyToken() no token", done => {
    sut
      .verifyToken(null)
      .then(resp => {
        fail("shouldn't return");
        done();
      })
      .catch(err => {
        expect(err).toEqual("no token");
        done();
      });
  });

  describe("verifyToken() happy path", () => {
    const DATE_TO_USE = new Date(1513399280000);
    Object.keys(jwts).forEach(didType => {
      test(didType, done => {
        const eventToken = jwts[didType];
        Date.now = jest.genMockFunction().mockReturnValue(DATE_TO_USE);

        sut.verifyToken(eventToken).then(
          resp => {
            expect(resp.jwt).toEqual(eventToken);
            expect(resp.payload.event.address).toEqual(
              "2ozsFQWAU7CpHZLqu2wSYbJFWzDNB26aoCF"
            );
            done();
          },
          error => {
            expect(error).toBeUndefined();
            done();
          }
        );
      });
    });
  });
});
