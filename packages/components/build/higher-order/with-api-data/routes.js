"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.array.find");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNormalizedRegExp = getNormalizedRegExp;
exports.isRouteMatch = isRouteMatch;
exports.getRoute = void 0;

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

var _lodash = require("lodash");

var _rememo = _interopRequireDefault(require("rememo"));

/**
 * External dependencies
 */

/**
 * Match PCRE named subpatterns in a string. This implementation is not strict
 * on balanced delimiters, but assumes this would be a broken pattern anyways.
 *
 * See: http://www.pcre.org/original/doc/html/pcrepattern.html#SEC16
 * See: http://php.net/manual/en/function.preg-match.php
 *
 * @type {RegExp}
 */
var RE_NAMED_SUBPATTERN = /\(\?P?[<']\w+[>'](.*?)\)/g;
/**
 * Coerces a REST route pattern to an equivalent JavaScript regular expression,
 * replacing named subpatterns (unsupported in JavaScript), allowing trailing
 * slash, allowing query parameters, but otherwise enforcing strict equality.
 *
 * @param {string} pattern PCRE regular expression string.
 *
 * @return {RegExp} Equivalent JavaScript RegExp.
 */

function getNormalizedRegExp(pattern) {
  pattern = pattern.replace(RE_NAMED_SUBPATTERN, '($1)');
  pattern = '^' + pattern + '/?(\\?.*)?$';
  return new RegExp(pattern);
}
/**
 * Returns true if the route path pattern string matches the given path.
 *
 * @param {string} pattern PCRE route path pattern.
 * @param {string} path    URL path.
 *
 * @return {boolean} Whether path is a match.
 */


function isRouteMatch(pattern, path) {
  return getNormalizedRegExp(pattern).test(path);
}
/**
 * Returns a REST route object for a given path, if one exists.
 *
 * @param {Object} schema REST schema.
 * @param {string} path   URL path.
 *
 * @returns {?Object} REST route.
 */


var getRoute = (0, _rememo.default)(function (schema, path) {
  return (0, _lodash.find)(schema.routes, function (route, pattern) {
    return isRouteMatch(pattern, path);
  });
});
exports.getRoute = getRoute;