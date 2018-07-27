"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.regexp.split");

var createPreloadingMiddleware = function createPreloadingMiddleware(preloadedData) {
  return function (options, next) {
    function getStablePath(path) {
      var splitted = path.split('?');
      var query = splitted[1];
      var base = splitted[0];

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
    }

    var _options$parse = options.parse,
        parse = _options$parse === void 0 ? true : _options$parse;

    if (typeof options.path === 'string' && parse) {
      var method = options.method || 'GET';
      var path = getStablePath(options.path);

      if ('GET' === method && preloadedData[path]) {
        return _promise.default.resolve(preloadedData[path].body);
      }
    }

    return next(options);
  };
};

var _default = createPreloadingMiddleware;
exports.default = _default;