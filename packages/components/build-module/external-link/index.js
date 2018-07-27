import _extends from "@babel/runtime/helpers/extends";
import "core-js/modules/es6.regexp.split";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { compact, uniq } from 'lodash';
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { forwardRef } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Dashicon from '../dashicon';
export function ExternalLink(_ref, ref) {
  var href = _ref.href,
      children = _ref.children,
      className = _ref.className,
      _ref$rel = _ref.rel,
      rel = _ref$rel === void 0 ? '' : _ref$rel,
      additionalProps = _objectWithoutProperties(_ref, ["href", "children", "className", "rel"]);

  rel = uniq(compact(_toConsumableArray(rel.split(' ')).concat(['external', 'noreferrer', 'noopener']))).join(' ');
  var classes = classnames('components-external-link', className);
  return createElement("a", _extends({}, additionalProps, {
    className: classes,
    href: href,
    target: "_blank",
    rel: rel,
    ref: ref
  }), children, createElement("span", {
    className: "screen-reader-text"
  },
  /* translators: accessibility text */
  __('(opens in a new window)')), createElement(Dashicon, {
    icon: "external",
    className: "components-external-link__icon"
  }));
}
export default forwardRef(ExternalLink);