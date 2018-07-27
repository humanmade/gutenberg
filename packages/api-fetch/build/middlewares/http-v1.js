"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

function httpV1Middleware(options, next) {
  var newOptions = (0, _objectSpread2.default)({}, options);

  if (newOptions.method) {
    if (['PATCH', 'PUT', 'DELETE'].indexOf(newOptions.method.toUpperCase()) >= 0) {
      if (!newOptions.headers) {
        newOptions.headers = {};
      }

      newOptions.headers['X-HTTP-Method-Override'] = newOptions.method;
      newOptions.headers['Content-Type'] = 'application/json';
      newOptions.method = 'POST';
    }
  }

  return next(newOptions, next);
}

var _default = httpV1Middleware;
exports.default = _default;