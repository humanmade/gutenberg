"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

function MenuItemsShortcut(_ref) {
  var shortcut = _ref.shortcut;

  if (!shortcut) {
    return null;
  }

  return (0, _element.createElement)("span", {
    className: "components-menu-item__shortcut"
  }, shortcut);
}

var _default = MenuItemsShortcut;
exports.default = _default;