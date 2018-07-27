import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import ReactDatePicker from 'react-datepicker';
import moment from 'moment';
/**
 * Module Constants
 */

var TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

function DatePicker(_ref) {
  var currentDate = _ref.currentDate,
      onChange = _ref.onChange,
      args = _objectWithoutProperties(_ref, ["currentDate", "onChange"]);

  var momentDate = currentDate ? moment(currentDate) : moment();

  var onChangeMoment = function onChangeMoment(newDate) {
    return onChange(newDate.format(TIMEZONELESS_FORMAT));
  };

  return createElement(ReactDatePicker, _extends({
    inline: true,
    selected: momentDate,
    onChange: onChangeMoment
  }, args));
}

export default DatePicker;