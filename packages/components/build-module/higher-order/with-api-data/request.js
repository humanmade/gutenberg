import _Promise from "@babel/runtime/core-js/promise";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.array.sort";
import "core-js/modules/es6.regexp.split";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

/**
 * External dependencies
 */
import memoize from 'memize';
import { mapKeys } from 'lodash';
/**
 * WordPress dependencies
 */

import apiFetch from '@wordpress/api-fetch';
export var getStablePath = memoize(function (path) {
  var _path$split = path.split('?'),
      _path$split2 = _slicedToArray(_path$split, 2),
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

export var cache = mapKeys(window._wpAPIDataPreload, function (value, key) {
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

export function getCachedResponse(request) {
  if (isRequestMethod(request, 'GET')) {
    return cache[getStablePath(request.path)];
  }
}
export function getResponseFromNetwork(request) {
  var promise = apiFetch(_objectSpread({}, request, {
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


  return _Promise.resolve(promise);
}
export function isRequestMethod(request, method) {
  return request.method === method;
}
export default function (request) {
  var cachedResponse = getCachedResponse(request);

  if (cachedResponse) {
    return _Promise.resolve(cachedResponse);
  }

  return getResponseFromNetwork(request);
}