const factory = require('factory-bot').factory;
const recruitStatus = require('../factory/models/recruitStatus.model').recruitStatus;

let recruitStatusFactory = function (jsonObject = {}) {
  factory.define('recruitStatus', recruitStatus, {
  });
  
  // factory.build('recruitStatus', jsonObject).then(recruitStatus => {
  //   return recruitStatus;
  // });  
};

module.exports.recruitStatusFactory = recruitStatusFactory;