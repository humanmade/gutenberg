import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { DOWN } from '@wordpress/keycodes';
/**
 * Internal dependencies
 */

import IconButton from '../icon-button';
import Dashicon from '../dashicon';
import Dropdown from '../dropdown';
import { NavigableMenu } from '../navigable-container';

function DropdownMenu(_ref) {
  var _ref$icon = _ref.icon,
      icon = _ref$icon === void 0 ? 'menu' : _ref$icon,
      label = _ref.label,
      menuLabel = _ref.menuLabel,
      controls = _ref.controls;

  if (!controls || !controls.length) {
    return null;
  }

  return createElement(Dropdown, {
    className: "components-dropdown-menu",
    contentClassName: "components-dropdown-menu__popover",
    renderToggle: function renderToggle(_ref2) {
      var isOpen = _ref2.isOpen,
          onToggle = _ref2.onToggle;

      var openOnArrowDown = function openOnArrowDown(event) {
        if (!isOpen && event.keyCode === DOWN) {
          event.preventDefault();
          event.stopPropagation();
          onToggle();
        }
      };

      return createElement(IconButton, {
        className: classnames('components-dropdown-menu__toggle', {
          'is-active': isOpen
        }),
        icon: icon,
        onClick: onToggle,
        onKeyDown: openOnArrowDown,
        "aria-haspopup": "true",
        "aria-expanded": isOpen,
        label: label,
        tooltip: label
      }, createElement(Dashicon, {
        icon: "arrow-down"
      }));
    },
    renderContent: function renderContent(_ref3) {
      var onClose = _ref3.onClose;
      return createElement(NavigableMenu, {
        className: "components-dropdown-menu__menu",
        role: "menu",
        "aria-label": menuLabel
      }, controls.map(function (control, index) {
        return createElement(IconButton, {
          key: index,
          onClick: function onClick(event) {
            event.stopPropagation();
            onClose();

            if (control.onClick) {
              control.onClick();
            }
          },
          className: "components-dropdown-menu__menu-item",
          icon: control.icon,
          role: "menuitem"
        }, control.title);
      }));
    }
  });
}

export default DropdownMenu;