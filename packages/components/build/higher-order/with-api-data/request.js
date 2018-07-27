"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCachedResponse = getCachedResponse;
exports.getResponseFromNetwork = getResponseFromNetwork;
exports.isRequestMethod = isRequestMethod;
exports.default = _default;
exports.cache = exports.getStablePath = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.regexp.split");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _memize = _interopRequireDefault(require("memize"));

var _lodash = require("lodash");

var _apiFetch = _interopRequireDefault(require("@wordpress/api-fetch"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
var getStablePath = (0, _memize.default)(function (path) {
  var _path$split = path.split('?'),
      _path$split2 = (0, _slicedToArray2.default)(_path$split, 2),
      base = _path$split2[0],
      query = _path$split2[1];

  if (!query) {
    return base;
  } // 'b=1&c=2&a=5'


  return base + '?' + query // [ 'b=1', 'c=2', 'a=5' ]
  .split('&') // [ [ 'b, '1' ], [ 'c', '2' ], [ 'a', '5' ] ]
  .map(function (entry) {
    return entry.split('=');
  }) // [ [ 'a', '5' ], [ 'b, '1' ], [ 'c', '2' ] ]
  .sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  }) // [ 'a=5', 'b=1', 'c=2' ]
  .map(function (pair) {
    return pair.join('=');
  }) // 'a=5&b=1&c=2'
  .join('&');
});
/**
 * Response cache of path to response (object of data, headers arrays).
 * Optionally populated from window global for preloading.
 *
 * @type {Object}
 */

exports.getStablePath = getStablePath;
var cache = (0, _lodash.mapKeys)(window._wpAPIDataPreload, function (value, key) {
  return getStablePath(key);
});
/**
 * Returns a response payload if GET request and a cached result exists, or
 * undefined otherwise.
 *
 * @param {Object} request Request object (path, method).
 *
 * @return {?Object} Response object (body, headers).
 */

exports.cache = cache;

function getCachedResponse(request) {
  if (isRequestMethod(request, 'GET')) {
    return cache[getStablePath(request.path)];
  }
}

function getResponseFromNetwork(request) {
  var promise = (0, _apiFetch.default)((0, _objectSpread2.default)({}, request, {
    parse: false
  })).then(function (response) {
    return response.json().then(function (body) {
      return {
        body: body,
        headers: response.headers
      };
    });
  });

  if (isRequestMethod(request, 'GET')) {
    promise.then(function (response) {
      cache[getStablePath(request.path)] = response;
    });
  } // Upgrade jQuery.Deferred to native promise


  return _promise.default.resolve(promise);
}

function isRequestMethod(request, method) {
  return request.method === method;
}

function _default(request) {
  var cachedResponse = getCachedResponse(request);

  if (cachedResponse) {
    return _promise.default.resolve(cachedResponse);
  }

  return getResponseFromNetwork(request);
}