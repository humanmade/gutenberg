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

var _ = require("../");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function Notice(_ref) {
  var className = _ref.className,
      status = _ref.status,
      children = _ref.children,
      _ref$onRemove = _ref.onRemove,
      onRemove = _ref$onRemove === void 0 ? _lodash.noop : _ref$onRemove,
      _ref$isDismissible = _ref.isDismissible,
      isDismissible = _ref$isDismissible === void 0 ? true : _ref$isDismissible,
      _ref$actions = _ref.actions,
      actions = _ref$actions === void 0 ? [] : _ref$actions;
  var classes = (0, _classnames.default)(className, 'components-notice', 'is-' + status, {
    'is-dismissible': isDismissible
  });
  return (0, _element.createElement)("div", {
    className: classes
  }, (0, _element.createElement)("div", {
    className: "components-notice__content"
  }, children, actions.map(function (_ref2, index) {
    var label = _ref2.label,
        url = _ref2.url,
        onClick = _ref2.onClick;
    return (0, _element.createElement)(_.Button, {
      key: index,
      href: url,
      isLink: !!url,
      onClick: onClick,
      className: "components-notice__action"
    }, label);
  })), isDismissible && (0, _element.createElement)(_.IconButton, {
    className: "components-notice__dismiss",
    icon: "no",
    label: (0, _i18n.__)('Dismiss this notice'),
    onClick: onRemove,
    tooltip: false
  }));
}

var _default = Notice;
exports.default = _default;
//# sourceMappingURL=index.js.map