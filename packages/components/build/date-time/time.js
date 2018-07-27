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

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _i18n = require("@wordpress/i18n");

var _button = _interopRequireDefault(require("../button"));

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
 * Module Constants
 */
var TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

var TimePicker =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(TimePicker, _Component);

  function TimePicker() {
    var _this;

    (0, _classCallCheck2.default)(this, TimePicker);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TimePicker).apply(this, arguments));
    _this.state = {
      hours: '',
      minutes: '',
      am: true,
      date: null
    };
    _this.updateHours = _this.updateHours.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.updateMinutes = _this.updateMinutes.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.onChangeHours = _this.onChangeHours.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.onChangeMinutes = _this.onChangeMinutes.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(TimePicker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.syncState(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props = this.props,
          currentTime = _this$props.currentTime,
          is12Hour = _this$props.is12Hour;

      if (currentTime !== prevProps.currentTime || is12Hour !== prevProps.is12Hour) {
        this.syncState(this.props);
      }
    }
  }, {
    key: "syncState",
    value: function syncState(_ref) {
      var currentTime = _ref.currentTime,
          is12Hour = _ref.is12Hour;
      var selected = currentTime ? (0, _moment.default)(currentTime) : (0, _moment.default)();
      var minutes = selected.format('mm');
      var am = selected.format('A');
      var hours = selected.format(is12Hour ? 'hh' : 'HH');
      var date = currentTime ? (0, _moment.default)(currentTime) : (0, _moment.default)();
      this.setState({
        minutes: minutes,
        hours: hours,
        am: am,
        date: date
      });
    }
  }, {
    key: "updateHours",
    value: function updateHours() {
      var _this$props2 = this.props,
          is12Hour = _this$props2.is12Hour,
          onChange = _this$props2.onChange;
      var _this$state = this.state,
          am = _this$state.am,
          hours = _this$state.hours,
          date = _this$state.date;
      var value = parseInt(hours, 10);

      if (!(0, _lodash.isInteger)(value) || is12Hour && (value < 1 || value > 12) || !is12Hour && (value < 0 || value > 23)) {
        this.syncState(this.props);
        return;
      }

      var newDate = is12Hour ? date.clone().hours(am === 'AM' ? value % 12 : (value % 12 + 12) % 24) : date.clone().hours(value);
      this.setState({
        date: newDate
      });
      var formattedDate = newDate.format(TIMEZONELESS_FORMAT);
      onChange(formattedDate);
    }
  }, {
    key: "updateMinutes",
    value: function updateMinutes() {
      var onChange = this.props.onChange;
      var _this$state2 = this.state,
          minutes = _this$state2.minutes,
          date = _this$state2.date;
      var value = parseInt(minutes, 10);

      if (!(0, _lodash.isInteger)(value) || value < 0 || value > 59) {
        this.syncState(this.props);
        return;
      }

      var newDate = date.clone().minutes(value);
      this.setState({
        date: newDate
      });
      var formattedDate = newDate.format(TIMEZONELESS_FORMAT);
      onChange(formattedDate);
    }
  }, {
    key: "updateAmPm",
    value: function updateAmPm(value) {
      var _this2 = this;

      return function () {
        var onChange = _this2.props.onChange;
        var _this2$state = _this2.state,
            am = _this2$state.am,
            date = _this2$state.date,
            hours = _this2$state.hours;

        if (am === value) {
          return;
        }

        var newDate;

        if (value === 'PM') {
          newDate = date.clone().hours((parseInt(hours, 10) % 12 + 12) % 24);
        } else {
          newDate = date.clone().hours(parseInt(hours, 10) % 12);
        }

        _this2.setState({
          date: newDate
        });

        var formattedDate = newDate.format(TIMEZONELESS_FORMAT);
        onChange(formattedDate);
      };
    }
  }, {
    key: "onChangeHours",
    value: function onChangeHours(event) {
      this.setState({
        hours: event.target.value
      });
    }
  }, {
    key: "onChangeMinutes",
    value: function onChangeMinutes(event) {
      this.setState({
        minutes: event.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var is12Hour = this.props.is12Hour;
      var _this$state3 = this.state,
          minutes = _this$state3.minutes,
          hours = _this$state3.hours,
          am = _this$state3.am;
      return (0, _element.createElement)("div", {
        className: "components-time-picker"
      }, (0, _element.createElement)("input", {
        className: "components-time-picker__input",
        type: "text",
        value: hours,
        onChange: this.onChangeHours,
        onBlur: this.updateHours
      }), (0, _element.createElement)("span", {
        className: "components-time-picker__separator"
      }, ":"), (0, _element.createElement)("input", {
        className: "components-time-picker__input",
        type: "text",
        value: minutes,
        onChange: this.onChangeMinutes,
        onBlur: this.updateMinutes
      }), is12Hour && (0, _element.createElement)("div", null, (0, _element.createElement)(_button.default, {
        isDefault: true,
        className: "components-time-picker__am-button",
        isToggled: am === 'AM',
        onClick: this.updateAmPm('AM')
      }, (0, _i18n.__)('AM')), (0, _element.createElement)(_button.default, {
        isDefault: true,
        className: "components-time-picker__pm-button",
        isToggled: am === 'PM',
        onClick: this.updateAmPm('PM')
      }, (0, _i18n.__)('PM'))));
    }
  }]);
  return TimePicker;
}(_element.Component);

var _default = TimePicker;
exports.default = _default;