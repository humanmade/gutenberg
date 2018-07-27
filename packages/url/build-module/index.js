import "core-js/modules/es6.regexp.search";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/**
 * External dependencies
 */
import { parse, format } from 'url';
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

export function addQueryArgs(url, args) {
  var parsedURL = parse(url, true);

  var query = _objectSpread({}, parsedURL.query, args);

  delete parsedURL.search;
  return format(_objectSpread({}, parsedURL, {
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

export function prependHTTP(url) {
  if (!USABLE_HREF_REGEXP.test(url) && !EMAIL_REGEXP.test(url)) {
    return 'http://' + url;
  }

  return url;
}