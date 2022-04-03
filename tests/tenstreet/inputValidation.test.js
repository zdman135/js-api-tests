const { request, expect } = require("../../.mocharc");
const { envConfig } = require("../../setup");
const factory = require('factory-bot').factory;
const { recruitStatusFactory } = require("../../lib/factory/recruitStatus.factory");
const { requestHeadersFactory } = require("../../lib/factory/requestHeaders.factory");


describe("Input Validation", () => {
  const url = `${envConfig.baseUrl}/index.php?option=com_api&app=tenstreet&resource=recruitstatus&format=raw`
  let recruitStatusHeaders, recruitStatusPostData;

  before("Initializing Factories", () => {
    recruitStatusFactory();
    requestHeadersFactory();
  })

  context("No data", () => {
    before("Build Test Data and Set Headers", () => {
      recruitStatusPostData = {};
      factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
        .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
    });

    it("should fail with input data is missing or not in JSON format", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("FAIL");
      expect(responseText.err_msg).to.eql("Input Data Is Missing Or Not In JSON Format");
      expect(responseText.err_code).to.eql(422);
    });
  })

  context("Not using recruit_status as key", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatus.referal_status = recruitStatus.recruit_status;
        delete recruitStatus.recruit_status;

        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should fail with wrong endpoint error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("FAIL");
      expect(responseText.err_msg).to.eql("Wrong Endpoint");
      expect(responseText.err_code).to.eql(422);
    });
  })

  context.only("Application Id is missing", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatus.recruit_status[0].ApplicationId = "";
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should Fail with Missing Application Id error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("FAIL");
      expect(responseText.err_code).to.eql("400");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");
      expect(responseText.data[0].Error).to.eql("Missing Application ID (ApplicationId)");
    });
  })

  context("Application Id must be numeric", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { ApplicationId: "test" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should fail with Application Id must be numeric", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("FAIL");
      expect(responseText.err_code).to.eql("400");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");
      expect(responseText.data[0].Error).to.eql("Application ID (ApplicationId) must be Numeric");
    });
  })

  context("NEED PROPER DATA FOR THIS TEST Application Id is less than 10 digits", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { ApplicationId: "123456789" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should pass with no errors", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");
    });
  })

  context("Email field is empty", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatus.recruit_status[0].Email = "";
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Bad input in email field", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Email: "Test" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Referral Employee Number given is not numeric", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Referral_Employee_Number: "not numeric" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Referral Employee Number given and starts with 0", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Referral_Employee_Number: "000234" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Referral Employee number and Driver Id are null", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatus.recruit_status[0].Referral_Employee_Number = null;
        recruitStatus.recruit_status[0].DriverId = null;
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("records pushed into db tables", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check goes here 
    });
  })

  context("Driver Id given but not numeric", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {DriverId: "test"}).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should send an error email to the user", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // email check goes here
    });
  })

  context("DriverId given and it starts with 0", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { DriverId: "000345" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Referral Employee Number DriverId given are the same", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Referral_Employee_Number: "987654", DriverId: "987654" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should email user notifying error", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");


      // email check goes here

    });
  })

  context("Referral Employee Number and DriverId are empty and Application Status to Interview", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {Application_Status: "Interview"}).then(recruitStatus => {
        recruitStatus.recruit_status[0].Referral_Employee_Number = "";
        recruitStatus.recruit_status[0].DriverId = "";
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should push record into recruit table and but not referrals table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Referral Employee Number is empty", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {Application_Status: "Interview"}).then(recruitStatus => {
        recruitStatus.recruit_status[0].Referral_Employee_Number = "";
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should push record only into recruit table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Last name of Recruit is changed", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Last_Name: "Test" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update the last name in the recruits table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Driver Id can be updated", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update the DriverId in the recruits table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Add Referral Employee Number", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Last_Name: "Test" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update the referral employee number, recruits table updated and referral created in referrals table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Update last name, and change status to Show", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Application_Status: "Show" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update both recruit and referral table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("#20 Change email of recruit", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', { Email: "test@example.com" }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should send a failure email to the user", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // email check here

    });
  })

  context("Change Driver Id with already valid registered email", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus').then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should send a failure email to the user", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // email check here

    });
  })

  context("Change Employee Referral Number with already valid registered email and DriverId / Update Last Name and App Status to Hired Complete", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {
        Referral_Employee_Number: "38543",
        Last_Name: "TestLastName",
        Application_Status: "Hired - Complete"
      }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should send a failure email to the user", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // email check here

    });
  })

  context("Update Last Name and Referral Employee Number / Application Status Hired Complete", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {
        Application_Status: "Hired - Complete"
      }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update record successfully", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Ensure Duplicate Squad Member is not created", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {
        Referral_Employee_Number: "38543",
        Last_Name: "TestLastName",
        Application_Status: "Hired - Complete"
      }).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should not create a duplicate squade members in the db tables", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })

  context("Use a Referral Number that is a real driver in Joomla but not a VA", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {Referral_Employee_Number: "38543"}).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should send warning email to user and record pushed to tribe member, recruit, and referrals table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // email check here
      // db check here

    });
  })

  context("Invalid Application Status sent", () => {
    before("Build Test Data and Set Headers", () => {
      factory.build('recruitStatus', {Application_Status: "awelrjaflkjqegjoergoijewf"}).then(recruitStatus => {
        recruitStatusPostData = recruitStatus;
        factory.build('requestHeaders', { "Content-Length": JSON.stringify(recruitStatusPostData).length.toString() })
          .then(requestHeaders => { recruitStatusHeaders = requestHeaders });
      })
    });

    it("should update the status in the referrals table", async () => {
      const response = await request
        .post(url)
        .set(recruitStatusHeaders.requestHeaders)
        .send(JSON.stringify(recruitStatusPostData));

      let responseText = JSON.parse(response.text);
      expect(response.status).to.eql(200);
      expect(responseText.status).to.eql("SUCCESS");
      expect(responseText.api).to.eql("tenstreet.recruitstatus");

      // db check here

    });
  })
});