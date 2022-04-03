const { faker } = require("../../../.mocharc");

class RecruitStatus {
  constructor(recruit_status = {}) {
    this.recruit_status = Object.assign([
      {
        ApplicationId: recruit_status.ApplicationId || "123",
        ApplicantId: 12345678,
        Referral_Employee_Number: recruit_status.Referral_Employee_Number || "987654",
        Referral_Employee_name: faker.name.findName(),
        DriverId: recruit_status.DriverId || faker.random.number({min: 100000, max:999999}).toString(),
        Email: recruit_status.Email || faker.internet.email(),
        Phone: "404-123-1234",
        First_Name: recruit_status.First_Name || faker.name.firstName(),
        Last_Name: recruit_status.Last_Name || faker.name.lastName(),
        Application_Status: recruit_status.Application_Status || "Hired complete"
        // age: recruit_status.age || 27,
      }]
    )
  }
}

module.exports.recruitStatus = RecruitStatus;