"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidHref = isValidHref;

var _lodash = require("lodash");

var _url = require("@wordpress/url");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Check for issues with the provided href.
 *
 * @param {string} href The href.
 *
 * @return {boolean} Is the href invalid?
 */
function isValidHref(href) {
  if (!href) {
    return false;
  }

  var trimmedHref = href.trim();

  if (!trimmedHref) {
    return false;
  } // Does the href start with something that looks like a url protocol?


  if (/^\S+:/.test(trimmedHref)) {
    var protocol = (0, _url.getProtocol)(trimmedHref);

    if (!(0, _url.isValidProtocol)(protocol)) {
      return false;
    }

    var authority = (0, _url.getAuthority)(trimmedHref);

    if (!(0, _url.isValidAuthority)(authority)) {
      return false;
    }

    var path = (0, _url.getPath)(trimmedHref);

    if (path && !(0, _url.isValidPath)(path)) {
      return false;
    }

    var queryString = (0, _url.getQueryString)(trimmedHref);

    if (queryString && !(0, _url.isValidQueryString)(queryString)) {
      return false;
    }

    var fragment = (0, _url.getFragment)(trimmedHref);

    if (fragment && !(0, _url.isValidFragment)(trimmedHref)) {
      return false;
    }
  } // Validate anchor links.


  if ((0, _lodash.startsWith)(trimmedHref, '#') && !(0, _url.isValidFragment)(trimmedHref)) {
    return false;
  }

  return true;
}
//# sourceMappingURL=utils.js.map