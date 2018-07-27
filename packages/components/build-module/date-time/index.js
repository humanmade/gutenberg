import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { createElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { default as DatePicker } from './date';
import { default as TimePicker } from './time';
export { DatePicker, TimePicker };
export function DateTimePicker(_ref) {
  var currentDate = _ref.currentDate,
      onChange = _ref.onChange,
      is12Hour = _ref.is12Hour,
      args = _objectWithoutProperties(_ref, ["currentDate", "onChange", "is12Hour"]);

  return [createElement(DatePicker, _extends({
    key: "date-picker",
    currentDate: currentDate,
    onChange: onChange
  }, args)), createElement(TimePicker, {
    key: "time-picker",
    currentTime: currentDate,
    onChange: onChange,
    is12Hour: is12Hour
  })];
}