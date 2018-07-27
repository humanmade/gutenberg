"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _i18n = require("@wordpress/i18n");

var _nonce = _interopRequireDefault(require("./middlewares/nonce"));

var _rootUrl = _interopRequireDefault(require("./middlewares/root-url"));

var _preloading = _interopRequireDefault(require("./middlewares/preloading"));

var _namespaceEndpoint = _interopRequireDefault(require("./middlewares/namespace-endpoint"));

var _httpV = _interopRequireDefault(require("./middlewares/http-v1"));

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
var middlewares = [];

function registerMiddleware(middleware) {
  middlewares.push(middleware);
}

function apiFetch(options) {
  var raw = function raw(nextOptions) {
    var url = nextOptions.url,
        path = nextOptions.path,
        body = nextOptions.body,
        data = nextOptions.data,
        _nextOptions$parse = nextOptions.parse,
        parse = _nextOptions$parse === void 0 ? true : _nextOptions$parse,
        remainingOptions = (0, _objectWithoutProperties2.default)(nextOptions, ["url", "path", "body", "data", "parse"]);
    var headers = remainingOptions.headers || {};

    if (!headers['Content-Type'] && data) {
      headers['Content-Type'] = 'application/json';
    }

    var responsePromise = window.fetch(url || path, (0, _objectSpread2.default)({}, remainingOptions, {
      credentials: 'include',
      body: body || (0, _stringify.default)(data),
      headers: headers
    }));

    var checkStatus = function checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      throw response;
    };

    var parseResponse = function parseResponse(response) {
      if (parse) {
        return response.json ? response.json() : _promise.default.reject(response);
      }

      return response;
    };

    return responsePromise.then(checkStatus).then(parseResponse).catch(function (response) {
      if (!parse) {
        throw response;
      }

      var invalidJsonError = {
        code: 'invalid_json',
        message: (0, _i18n.__)('The response is not a valid JSON response.')
      };

      if (!response || !response.json) {
        throw invalidJsonError;
      }

      return response.json().catch(function () {
        throw invalidJsonError;
      }).then(function (error) {
        var unknownError = {
          code: 'unknown_error',
          message: (0, _i18n.__)('An unknown error occurred.')
        };
        throw error || unknownError;
      });
    });
  };

  var steps = [raw, _httpV.default, _namespaceEndpoint.default].concat(middlewares);

  var next = function next(nextOptions) {
    var nextMiddleware = steps.pop();
    return nextMiddleware(nextOptions, next);
  };

  return next(options);
}

apiFetch.use = registerMiddleware;
apiFetch.createNonceMiddleware = _nonce.default;
apiFetch.createPreloadingMiddleware = _preloading.default;
apiFetch.createRootURLMiddleware = _rootUrl.default;
var _default = apiFetch;
exports.default = _default;