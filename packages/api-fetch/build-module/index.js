import _Promise from "@babel/runtime/core-js/promise";
import _JSON$stringify from "@babel/runtime/core-js/json/stringify";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */

import createNonceMiddleware from './middlewares/nonce';
import createRootURLMiddleware from './middlewares/root-url';
import createPreloadingMiddleware from './middlewares/preloading';
import namespaceEndpointMiddleware from './middlewares/namespace-endpoint';
import httpV1Middleware from './middlewares/http-v1';
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
        remainingOptions = _objectWithoutProperties(nextOptions, ["url", "path", "body", "data", "parse"]);

    var headers = remainingOptions.headers || {};

    if (!headers['Content-Type'] && data) {
      headers['Content-Type'] = 'application/json';
    }

    var responsePromise = window.fetch(url || path, _objectSpread({}, remainingOptions, {
      credentials: 'include',
      body: body || _JSON$stringify(data),
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
        return response.json ? response.json() : _Promise.reject(response);
      }

      return response;
    };

    return responsePromise.then(checkStatus).then(parseResponse).catch(function (response) {
      if (!parse) {
        throw response;
      }

      var invalidJsonError = {
        code: 'invalid_json',
        message: __('The response is not a valid JSON response.')
      };

      if (!response || !response.json) {
        throw invalidJsonError;
      }

      return response.json().catch(function () {
        throw invalidJsonError;
      }).then(function (error) {
        var unknownError = {
          code: 'unknown_error',
          message: __('An unknown error occurred.')
        };
        throw error || unknownError;
      });
    });
  };

  var steps = [raw, httpV1Middleware, namespaceEndpointMiddleware].concat(middlewares);

  var next = function next(nextOptions) {
    var nextMiddleware = steps.pop();
    return nextMiddleware(nextOptions, next);
  };

  return next(options);
}

apiFetch.use = registerMiddleware;
apiFetch.createNonceMiddleware = createNonceMiddleware;
apiFetch.createPreloadingMiddleware = createPreloadingMiddleware;
apiFetch.createRootURLMiddleware = createRootURLMiddleware;
export default apiFetch;