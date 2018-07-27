"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _lodash = require("lodash");

var _classnames = _interopRequireDefault(require("classnames"));

var _i18n = require("@wordpress/i18n");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
function Notice(_ref) {
  var className = _ref.className,
      status = _ref.status,
      children = _ref.children,
      _ref$onRemove = _ref.onRemove,
      onRemove = _ref$onRemove === void 0 ? _lodash.noop : _ref$onRemove,
      _ref$isDismissible = _ref.isDismissible,
      isDismissible = _ref$isDismissible === void 0 ? true : _ref$isDismissible;
  var classNames = (0, _classnames.default)(className, 'notice notice-alt notice-' + status, {
    'is-dismissible': isDismissible
  });
  return (0, _element.createElement)("div", {
    className: classNames
  }, (0, _lodash.isString)(children) ? (0, _element.createElement)("p", null, children) : children, isDismissible && (0, _element.createElement)("button", {
    className: "notice-dismiss",
    type: "button",
    onClick: onRemove
  }, (0, _element.createElement)("span", {
    className: "screen-reader-text"
  }, (0, _i18n.__)('Dismiss this notice'))));
}

var _default = Notice;
exports.default = _default;