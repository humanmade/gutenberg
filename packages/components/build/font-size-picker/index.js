"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FontSizePicker;

var _element = require("@wordpress/element");

require("core-js/modules/es6.function.name");

var _lodash = require("lodash");

var _i18n = require("@wordpress/i18n");

var _button = _interopRequireDefault(require("../button"));

var _buttonGroup = _interopRequireDefault(require("../button-group"));

var _rangeControl = _interopRequireDefault(require("../range-control"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function FontSizePicker(_ref) {
  var _ref$fontSizes = _ref.fontSizes,
      fontSizes = _ref$fontSizes === void 0 ? [] : _ref$fontSizes,
      fallbackFontSize = _ref.fallbackFontSize,
      value = _ref.value,
      onChange = _ref.onChange;
  return (0, _element.createElement)(_element.Fragment, null, (0, _element.createElement)("div", {
    className: "components-font-size-picker__buttons"
  }, (0, _element.createElement)(_buttonGroup.default, {
    "aria-label": (0, _i18n.__)('Font Size')
  }, (0, _lodash.map)(fontSizes, function (_ref2) {
    var name = _ref2.name,
        size = _ref2.size,
        shortName = _ref2.shortName;
    return (0, _element.createElement)(_button.default, {
      key: size,
      isLarge: true,
      isPrimary: value === size,
      "aria-pressed": value === size,
      onClick: function onClick() {
        return onChange(size);
      }
    }, shortName || name);
  })), (0, _element.createElement)(_button.default, {
    isLarge: true,
    onClick: function onClick() {
      return onChange(undefined);
    }
  }, (0, _i18n.__)('Reset'))), (0, _element.createElement)(_rangeControl.default, {
    className: "components-font-size-picker__custom-input",
    label: (0, _i18n.__)('Custom Size'),
    value: value || '',
    initialPosition: fallbackFontSize,
    onChange: onChange,
    min: 12,
    max: 100,
    beforeIcon: "editor-textcolor",
    afterIcon: "editor-textcolor"
  }));
}