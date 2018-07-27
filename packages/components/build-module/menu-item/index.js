import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isString } from 'lodash';
/**
 * WordPress dependencies
 */

import { cloneElement } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Button from '../button';
import Shortcut from './shortcut';
import IconButton from '../icon-button';
/**
 * Renders a generic menu item for use inside the more menu.
 *
 * @return {WPElement} More menu item.
 */

function MenuItem(_ref) {
  var children = _ref.children,
      className = _ref.className,
      icon = _ref.icon,
      onClick = _ref.onClick,
      shortcut = _ref.shortcut,
      _ref$isSelected = _ref.isSelected,
      isSelected = _ref$isSelected === void 0 ? false : _ref$isSelected;
  className = classnames('components-menu-item__button', className, {
    'has-icon': icon
  });

  if (icon) {
    if (!isString(icon)) {
      icon = cloneElement(icon, {
        className: 'components-menu-items__item-icon',
        height: 20,
        width: 20
      });
    }

    return createElement(IconButton, {
      className: className,
      icon: icon,
      onClick: onClick,
      "aria-pressed": isSelected
    }, children, createElement(Shortcut, {
      shortcut: shortcut
    }));
  }

  return createElement(Button, {
    className: className,
    onClick: onClick,
    "aria-pressed": isSelected
  }, children, createElement(Shortcut, {
    shortcut: shortcut
  }));
}

export default MenuItem;