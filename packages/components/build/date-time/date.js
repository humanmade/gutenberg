"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _moment = _interopRequireDefault(require("moment"));

var _reactDates = require("react-dates");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Module Constants
 */
var TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

var DatePicker =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(DatePicker, _Component);

  function DatePicker() {
    var _this;

    (0, _classCallCheck2.default)(this, DatePicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DatePicker).apply(this, arguments));
    _this.onChangeMoment = _this.onChangeMoment.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(DatePicker, [{
    key: "onChangeMoment",
    value: function onChangeMoment(newDate) {
      var _this$props = this.props,
          currentDate = _this$props.currentDate,
          onChange = _this$props.onChange;
      var momentDate = currentDate ? (0, _moment.default)(currentDate) : (0, _moment.default)();
      var momentTime = {
        hours: momentDate.hours(),
        minutes: momentDate.minutes(),
        seconds: momentDate.seconds()
      };
      onChange(newDate.set(momentTime).format(TIMEZONELESS_FORMAT));
    }
  }, {
    key: "render",
    value: function render() {
      var currentDate = this.props.currentDate;
      var momentDate = currentDate ? (0, _moment.default)(currentDate) : (0, _moment.default)();
      return (0, _element.createElement)("div", {
        className: "components-datetime__date"
      }, (0, _element.createElement)(_reactDates.DayPickerSingleDateController, {
        block: true,
        date: momentDate,
        daySize: 30,
        focused: true,
        hideKeyboardShortcutsPanel: true // This is a hack to force the calendar to update on month or year change
        // https://github.com/airbnb/react-dates/issues/240#issuecomment-361776665
        ,
        key: "datepicker-controller-".concat(momentDate.format('MM-YYYY')),
        noBorder: true,
        numberOfMonths: 1,
        onDateChange: this.onChangeMoment,
        transitionDuration: 0,
        weekDayFormat: "ddd"
      }));
    }
  }]);
  return DatePicker;
}(_element.Component);

var _default = DatePicker;
exports.default = _default;
//# sourceMappingURL=date.js.map