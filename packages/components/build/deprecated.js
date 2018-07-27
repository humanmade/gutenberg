"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _compose = require("@wordpress/compose");

var _deprecated = _interopRequireDefault(require("@wordpress/deprecated"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
var deprecatedFunctions = {
  ifCondition: _compose.ifCondition,
  withGlobalEvents: _compose.withGlobalEvents,
  withInstanceId: _compose.withInstanceId,
  withSafeTimeout: _compose.withSafeTimeout,
  withState: _compose.withState
};

var _default = (0, _lodash.mapValues)(deprecatedFunctions, function (deprecatedFunction, key) {
  return function () {
    (0, _deprecated.default)('wp.components.' + key, {
      version: '3.5',
      alternative: 'wp.compose.' + key
    });
    return deprecatedFunction.apply(void 0, arguments);
  };
});

exports.default = _default;