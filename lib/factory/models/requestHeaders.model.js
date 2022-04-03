const { envConfig } = require("../../../setup");

class RequestHeaders {
    constructor(requestHeaders = {}) {
      this.requestHeaders = Object.assign(
        {
            Authorization: `Bearer ${envConfig.token}`,
            Host: "test30.roger.drivevariant.com",
            "User-Agent": `${envConfig.userAgent}`,
            "Content-Type": "application/json",
            "Content-Length": requestHeaders["Content-Length"] || ""
        },
        requestHeaders,
      )
    }
  }
  
  module.exports.requestHeaders = RequestHeaders;