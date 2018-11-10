/**
 * External dependencies
 */
import { startsWith } from 'lodash';
/**
 * WordPress dependencies
 */

import { getProtocol, isValidProtocol, getAuthority, isValidAuthority, getPath, isValidPath, getQueryString, isValidQueryString, getFragment, isValidFragment } from '@wordpress/url';
/**
 * Check for issues with the provided href.
 *
 * @param {string} href The href.
 *
 * @return {boolean} Is the href invalid?
 */

export function isValidHref(href) {
  if (!href) {
    return false;
  }

  var trimmedHref = href.trim();

  if (!trimmedHref) {
    return false;
  } // Does the href start with something that looks like a url protocol?


  if (/^\S+:/.test(trimmedHref)) {
    var protocol = getProtocol(trimmedHref);

    if (!isValidProtocol(protocol)) {
      return false;
    }

    var authority = getAuthority(trimmedHref);

    if (!isValidAuthority(authority)) {
      return false;
    }

    var path = getPath(trimmedHref);

    if (path && !isValidPath(path)) {
      return false;
    }

    var queryString = getQueryString(trimmedHref);

    if (queryString && !isValidQueryString(queryString)) {
      return false;
    }

    var fragment = getFragment(trimmedHref);

    if (fragment && !isValidFragment(trimmedHref)) {
      return false;
    }
  } // Validate anchor links.


  if (startsWith(trimmedHref, '#') && !isValidFragment(trimmedHref)) {
    return false;
  }

  return true;
}
//# sourceMappingURL=utils.js.map