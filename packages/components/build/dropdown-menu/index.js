"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classnames = _interopRequireDefault(require("classnames"));

var _keycodes = require("@wordpress/keycodes");

var _iconButton = _interopRequireDefault(require("../icon-button"));

var _dashicon = _interopRequireDefault(require("../dashicon"));

var _dropdown = _interopRequireDefault(require("../dropdown"));

var _navigableContainer = require("../navigable-container");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function DropdownMenu(_ref) {
  var _ref$icon = _ref.icon,
      icon = _ref$icon === void 0 ? 'menu' : _ref$icon,
      label = _ref.label,
      menuLabel = _ref.menuLabel,
      controls = _ref.controls;

  if (!controls || !controls.length) {
    return null;
  }

  return (0, _element.createElement)(_dropdown.default, {
    className: "components-dropdown-menu",
    contentClassName: "components-dropdown-menu__popover",
    renderToggle: function renderToggle(_ref2) {
      var isOpen = _ref2.isOpen,
          onToggle = _ref2.onToggle;

      var openOnArrowDown = function openOnArrowDown(event) {
        if (!isOpen && event.keyCode === _keycodes.DOWN) {
          event.preventDefault();
          event.stopPropagation();
          onToggle();
        }
      };

      return (0, _element.createElement)(_iconButton.default, {
        className: (0, _classnames.default)('components-dropdown-menu__toggle', {
          'is-active': isOpen
        }),
        icon: icon,
        onClick: onToggle,
        onKeyDown: openOnArrowDown,
        "aria-haspopup": "true",
        "aria-expanded": isOpen,
        label: label,
        tooltip: label
      }, (0, _element.createElement)(_dashicon.default, {
        icon: "arrow-down"
      }));
    },
    renderContent: function renderContent(_ref3) {
      var onClose = _ref3.onClose;
      return (0, _element.createElement)(_navigableContainer.NavigableMenu, {
        className: "components-dropdown-menu__menu",
        role: "menu",
        "aria-label": menuLabel
      }, controls.map(function (control, index) {
        return (0, _element.createElement)(_iconButton.default, {
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

var _default = DropdownMenu;
exports.default = _default;