import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";

/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { createElement, forwardRef } from '@wordpress/element';
/**
 * Internal dependencies
 */

import './style.scss';
export function Button(props, ref) {
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
      additionalProps = _objectWithoutProperties(props, ["href", "target", "isPrimary", "isLarge", "isSmall", "isToggled", "isBusy", "isDefault", "isLink", "isDestructive", "className", "disabled", "focus"]);

  var classes = classnames('components-button', className, {
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
  return createElement(tag, _objectSpread({}, tagProps, additionalProps, {
    className: classes,
    autoFocus: focus,
    ref: ref
  }));
}
export default forwardRef(Button);