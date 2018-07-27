"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _reactDatepicker = _interopRequireDefault(require("react-datepicker"));

var _moment = _interopRequireDefault(require("moment"));

/**
 * External dependencies
 */

/**
 * Module Constants
 */
var TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

function DatePicker(_ref) {
  var currentDate = _ref.currentDate,
      onChange = _ref.onChange,
      args = (0, _objectWithoutProperties2.default)(_ref, ["currentDate", "onChange"]);
  var momentDate = currentDate ? (0, _moment.default)(currentDate) : (0, _moment.default)();

  var onChangeMoment = function onChangeMoment(newDate) {
    return onChange(newDate.format(TIMEZONELESS_FORMAT));
  };

  return (0, _element.createElement)(_reactDatepicker.default, (0, _extends2.default)({
    inline: true,
    selected: momentDate,
    onChange: onChangeMoment
  }, args));
}

var _default = DatePicker;
exports.default = _default;