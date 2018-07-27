"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addQueryArgs = addQueryArgs;
exports.prependHTTP = prependHTTP;

require("core-js/modules/es6.regexp.search");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _url = require("url");

/**
 * External dependencies
 */
var EMAIL_REGEXP = /^(mailto:)?[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;
var USABLE_HREF_REGEXP = /^(?:[a-z]+:|#|\?|\.|\/)/i;
/**
 * Appends arguments to the query string of the url
 *
 * @param  {string} url   URL
 * @param  {Object} args  Query Args
 *
 * @return {string}       Updated URL
 */

function addQueryArgs(url, args) {
  var parsedURL = (0, _url.parse)(url, true);
  var query = (0, _objectSpread2.default)({}, parsedURL.query, args);
  delete parsedURL.search;
  return (0, _url.format)((0, _objectSpread2.default)({}, parsedURL, {
    query: query
  }));
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