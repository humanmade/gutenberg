import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { isInteger } from 'lodash';
import moment from 'moment';
/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Button from '../button';
/**
 * Module Constants
 */

var TIMEZONELESS_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

var TimePicker =
/*#__PURE__*/
function (_Component) {
  _inherits(TimePicker, _Component);

  function TimePicker() {
    var _this;

    _classCallCheck(this, TimePicker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TimePicker).apply(this, arguments));
    _this.state = {
      hours: '',
      minutes: '',
      am: true,
      date: null
    };
    _this.updateHours = _this.updateHours.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateMinutes = _this.updateMinutes.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeHours = _this.onChangeHours.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeMinutes = _this.onChangeMinutes.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(TimePicker, [{
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
      var selected = currentTime ? moment(currentTime) : moment();
      var minutes = selected.format('mm');
      var am = selected.format('A');
      var hours = selected.format(is12Hour ? 'hh' : 'HH');
      var date = currentTime ? moment(currentTime) : moment();
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

      if (!isInteger(value) || is12Hour && (value < 1 || value > 12) || !is12Hour && (value < 0 || value > 23)) {
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

      if (!isInteger(value) || value < 0 || value > 59) {
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
      return createElement("div", {
        className: "components-time-picker"
      }, createElement("input", {
        className: "components-time-picker__input",
        type: "text",
        value: hours,
        onChange: this.onChangeHours,
        onBlur: this.updateHours
      }), createElement("span", {
        className: "components-time-picker__separator"
      }, ":"), createElement("input", {
        className: "components-time-picker__input",
        type: "text",
        value: minutes,
        onChange: this.onChangeMinutes,
        onBlur: this.updateMinutes
      }), is12Hour && createElement("div", null, createElement(Button, {
        isDefault: true,
        className: "components-time-picker__am-button",
        isToggled: am === 'AM',
        onClick: this.updateAmPm('AM')
      }, __('AM')), createElement(Button, {
        isDefault: true,
        className: "components-time-picker__pm-button",
        isToggled: am === 'PM',
        onClick: this.updateAmPm('PM')
      }, __('PM'))));
    }
  }]);

  return TimePicker;
}(Component);

export default TimePicker;