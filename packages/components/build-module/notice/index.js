import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { isString, noop } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';

function Notice(_ref) {
  var className = _ref.className,
      status = _ref.status,
      children = _ref.children,
      _ref$onRemove = _ref.onRemove,
      onRemove = _ref$onRemove === void 0 ? noop : _ref$onRemove,
      _ref$isDismissible = _ref.isDismissible,
      isDismissible = _ref$isDismissible === void 0 ? true : _ref$isDismissible;
  var classNames = classnames(className, 'notice notice-alt notice-' + status, {
    'is-dismissible': isDismissible
  });
  return createElement("div", {
    className: classNames
  }, isString(children) ? createElement("p", null, children) : children, isDismissible && createElement("button", {
    className: "notice-dismiss",
    type: "button",
    onClick: onRemove
  }, createElement("span", {
    className: "screen-reader-text"
  }, __('Dismiss this notice'))));
}

export default Notice;