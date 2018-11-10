"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isURL = isURL;
exports.getProtocol = getProtocol;
exports.isValidProtocol = isValidProtocol;
exports.getAuthority = getAuthority;
exports.isValidAuthority = isValidAuthority;
exports.getPath = getPath;
exports.isValidPath = isValidPath;
exports.getQueryString = getQueryString;
exports.isValidQueryString = isValidQueryString;
exports.getFragment = getFragment;
exports.isValidFragment = isValidFragment;
exports.addQueryArgs = addQueryArgs;
exports.getQueryArg = getQueryArg;
exports.hasQueryArg = hasQueryArg;
exports.removeQueryArgs = removeQueryArgs;
exports.prependHTTP = prependHTTP;
exports.safeDecodeURI = safeDecodeURI;
exports.filterURLForDisplay = filterURLForDisplay;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _qs = require("qs");

/**
 * External dependencies
 */
var URL_REGEXP = /^(?:https?:)?\/\/\S+$/i;
var EMAIL_REGEXP = /^(mailto:)?[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;
var USABLE_HREF_REGEXP = /^(?:[a-z]+:|#|\?|\.|\/)/i;
/**
 * Determines whether the given string looks like a URL.
 *
 * @param {string} url The string to scrutinise.
 *
 * @return {boolean} Whether or not it looks like a URL.
 */

function isURL(url) {
  return URL_REGEXP.test(url);
}
/**
 * Returns the protocol part of the URL.
 *
 * @param {string} url The full URL.
 *
 * @return {?string} The protocol part of the URL.
 */


function getProtocol(url) {
  var matches = /^([^\s:]+:)/.exec(url);

  if (matches) {
    return matches[1];
  }
}
/**
 * Tests if a url protocol is valid.
 *
 * @param {string} protocol The url protocol.
 *
 * @return {boolean} True if the argument is a valid protocol (e.g. http://, tel:).
 */


function isValidProtocol(protocol) {
  if (!protocol) {
    return false;
  }

  return /^[a-z\-.\+]+[0-9]*:(?:\/\/)?\/?$/i.test(protocol);
}
/**
 * Returns the authority part of the URL.
 *
 * @param {string} url The full URL.
 *
 * @return {?string} The authority part of the URL.
 */


function getAuthority(url) {
  var matches = /^[^\/\s:]+:(?:\/\/)?\/?([^\/\s#?]+)[\/#?]{0,1}\S*$/.exec(url);

  if (matches) {
    return matches[1];
  }
}
/**
 * Checks for invalid characters within the provided authority.
 *
 * @param {string} authority A string containing the URL authority.
 *
 * @return {boolean} True if the argument contains a valid authority.
 */


function isValidAuthority(authority) {
  if (!authority) {
    return false;
  }

  return /^[^\s#?]+$/.test(authority);
}
/**
 * Returns the path part of the URL.
 *
 * @param {string} url The full URL.
 *
 * @return {?string} The path part of the URL.
 */


function getPath(url) {
  var matches = /^[^\/\s:]+:(?:\/\/)?[^\/\s#?]+[\/]([^\s#?]+)[#?]{0,1}\S*$/.exec(url);

  if (matches) {
    return matches[1];
  }
}
/**
 * Checks for invalid characters within the provided path.
 *
 * @param {string} path The URL path.
 *
 * @return {boolean} True if the argument contains a valid path
 */


function isValidPath(path) {
  if (!path) {
    return false;
  }

  return /^[^\s#?]+$/.test(path);
}
/**
 * Returns the query string part of the URL.
 *
 * @param {string} url The full URL.
 *
 * @return {?string} The query string part of the URL.
 */


function getQueryString(url) {
  var matches = /^\S+?\?([^\s#]+)/.exec(url);

  if (matches) {
    return matches[1];
  }
}
/**
 * Checks for invalid characters within the provided query string.
 *
 * @param {string} queryString The query string.
 *
 * @return {boolean} True if the argument contains a valid query string.
 */


function isValidQueryString(queryString) {
  if (!queryString) {
    return false;
  }

  return /^[^\s#?\/]+$/.test(queryString);
}
/**
 * Returns the fragment part of the URL.
 *
 * @param {string} url The full URL
 *
 * @return {?string} The fragment part of the URL.
 */


function getFragment(url) {
  var matches = /^\S+(#[^\s\?]*)/.exec(url);

  if (matches) {
    return matches[1];
  }
}
/**
 * Checks for invalid characters within the provided fragment.
 *
 * @param {string} fragment The url fragment.
 *
 * @return {boolean} True if the argument contains a valid fragment.
 */


function isValidFragment(fragment) {
  if (!fragment) {
    return false;
  }

  return /^#[^\s#?\/]*$/.test(fragment);
}
/**
 * Appends arguments to the query string of the url
 *
 * @param {string} url  URL
 * @param {Object} args Query Args
 *
 * @return {string} Updated URL
 */


function addQueryArgs(url, args) {
  var queryStringIndex = url.indexOf('?');
  var query = queryStringIndex !== -1 ? (0, _qs.parse)(url.substr(queryStringIndex + 1)) : {};
  var baseUrl = queryStringIndex !== -1 ? url.substr(0, queryStringIndex) : url;
  return baseUrl + '?' + (0, _qs.stringify)((0, _objectSpread2.default)({}, query, args));
}
/**
 * Returns a single query argument of the url
 *
 * @param {string} url URL
 * @param {string} arg Query arg name
 *
 * @return {Array|string} Query arg value.
 */


function getQueryArg(url, arg) {
  var queryStringIndex = url.indexOf('?');
  var query = queryStringIndex !== -1 ? (0, _qs.parse)(url.substr(queryStringIndex + 1)) : {};
  return query[arg];
}
/**
 * Determines whether the URL contains a given query arg.
 *
 * @param {string} url URL
 * @param {string} arg Query arg name
 *
 * @return {boolean} Whether or not the URL contains the query aeg.
 */


function hasQueryArg(url, arg) {
  return getQueryArg(url, arg) !== undefined;
}
/**
 * Removes arguments from the query string of the url
 *
 * @param {string} url  URL
 * @param {...string} args Query Args
 *
 * @return {string} Updated URL
 */


function removeQueryArgs(url) {
  var queryStringIndex = url.indexOf('?');
  var query = queryStringIndex !== -1 ? (0, _qs.parse)(url.substr(queryStringIndex + 1)) : {};
  var baseUrl = queryStringIndex !== -1 ? url.substr(0, queryStringIndex) : url;

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (arg) {
    return delete query[arg];
  });
  return baseUrl + '?' + (0, _qs.stringify)(query);
}
/**
 * Prepends "http://" to a url, if it looks like something that is meant to be a TLD.
 *
 * @param  {string} url The URL to test
 *
 * @return {string}     The updated URL
 */


function prependHTTP(url) {
  if (!USABLE_HREF_REGEXP.test(url) && !EMAIL_REGEXP.test(url)) {
    return 'http://' + url;
  }

  return url;
}
/**
 * Safely decodes a URI with `decodeURI`. Returns the URI unmodified if
 * `decodeURI` throws an error.
 *
 * @param {string} uri URI to decode.
 *
 * @return {string} Decoded URI if possible.
 */


function safeDecodeURI(uri) {
  try {
    return decodeURI(uri);
  } catch (uriError) {
    return uri;
  }
}
/**
 * Returns a URL for display.
 *
 * @param {string} url Original URL.
 *
 * @return {string} Displayed URL.
 */


function filterURLForDisplay(url) {
  // Remove protocol and www prefixes.
  var filteredURL = url.replace(/^(?:https?:)\/\/(?:www\.)?/, ''); // Ends with / and only has that single slash, strip it.

  if (filteredURL.match(/^[^\/]+\/$/)) {
    return filteredURL.replace('/', '');
  }

  return filteredURL;
}
//# sourceMappingURL=index.js.map