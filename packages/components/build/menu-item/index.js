"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

var _button = _interopRequireDefault(require("../button"));

var _shortcut = _interopRequireDefault(require("./shortcut"));

var _iconButton = _interopRequireDefault(require("../icon-button"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

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
  className = (0, _classnames.default)('components-menu-item__button', className, {
    'has-icon': icon
  });

  if (icon) {
    if (!(0, _lodash.isString)(icon)) {
      icon = (0, _element.cloneElement)(icon, {
        className: 'components-menu-items__item-icon',
        height: 20,
        width: 20
      });
    }

    return (0, _element.createElement)(_iconButton.default, {
      className: className,
      icon: icon,
      onClick: onClick,
      "aria-pressed": isSelected
    }, children, (0, _element.createElement)(_shortcut.default, {
      shortcut: shortcut
    }));
  }

  return (0, _element.createElement)(_button.default, {
    className: className,
    onClick: onClick,
    "aria-pressed": isSelected
  }, children, (0, _element.createElement)(_shortcut.default, {
    shortcut: shortcut
  }));
}

var _default = MenuItem;
exports.default = _default;