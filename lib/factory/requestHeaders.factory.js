const factory = require('factory-bot').factory;
const requestHeaders = require('../factory/models/requestHeaders.model').requestHeaders;

let requestHeadersFactory = () => {
  factory.define('requestHeaders', requestHeaders, {
  });
};

module.exports.requestHeadersFactory = requestHeadersFactory;