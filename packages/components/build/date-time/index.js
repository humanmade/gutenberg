"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateTimePicker = DateTimePicker;
Object.defineProperty(exports, "DatePicker", {
  enumerable: true,
  get: function get() {
    return _date.default;
  }
});
Object.defineProperty(exports, "TimePicker", {
  enumerable: true,
  get: function get() {
    return _time.default;
  }
});

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _date = _interopRequireDefault(require("./date"));

var _time = _interopRequireDefault(require("./time"));

/**
 * Internal dependencies
 */
function DateTimePicker(_ref) {
  var currentDate = _ref.currentDate,
      onChange = _ref.onChange,
      is12Hour = _ref.is12Hour,
      args = (0, _objectWithoutProperties2.default)(_ref, ["currentDate", "onChange", "is12Hour"]);
  return [(0, _element.createElement)(_date.default, (0, _extends2.default)({
    key: "date-picker",
    currentDate: currentDate,
    onChange: onChange
  }, args)), (0, _element.createElement)(_time.default, {
    key: "time-picker",
    currentTime: currentDate,
    onChange: onChange,
    is12Hour: is12Hour
  })];
}