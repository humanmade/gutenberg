"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = Button;
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classnames = _interopRequireDefault(require("classnames"));

var _element = require("@wordpress/element");

require("./style.scss");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function Button(props, ref) {
  var href = props.href,
      target = props.target,
      isPrimary = props.isPrimary,
      isLarge = props.isLarge,
      isSmall = props.isSmall,
      isToggled = props.isToggled,
      isBusy = props.isBusy,
      isDefault = props.isDefault,
      isLink = props.isLink,
      isDestructive = props.isDestructive,
      className = props.className,
      disabled = props.disabled,
      focus = props.focus,
      additionalProps = (0, _objectWithoutProperties2.default)(props, ["href", "target", "isPrimary", "isLarge", "isSmall", "isToggled", "isBusy", "isDefault", "isLink", "isDestructive", "className", "disabled", "focus"]);
  var classes = (0, _classnames.default)('components-button', className, {
    'is-button': isDefault || isPrimary || isLarge || isSmall,
    'is-default': isDefault || isLarge || isSmall,
    'is-primary': isPrimary,
    'is-large': isLarge,
    'is-small': isSmall,
    'is-toggled': isToggled,
    'is-busy': isBusy,
    'is-link': isLink,
    'is-destructive': isDestructive
  });
  var tag = href !== undefined && !disabled ? 'a' : 'button';
  var tagProps = tag === 'a' ? {
    href: href,
    target: target
  } : {
    type: 'button',
    disabled: disabled
  };
  return (0, _element.createElement)(tag, (0, _objectSpread2.default)({}, tagProps, additionalProps, {
    className: classes,
    autoFocus: focus,
    ref: ref
  }));
}

var _default = (0, _element.forwardRef)(Button);

exports.default = _default;