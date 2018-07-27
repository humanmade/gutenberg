import "core-js/modules/es6.function.name";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/**
 * External dependencies
 */
import { noop, isFunction } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, createPortal } from '@wordpress/element';
var occurrences = 0;

var Fill =
/*#__PURE__*/
function (_Component) {
  _inherits(Fill, _Component);

  function Fill() {
    var _this;

    _classCallCheck(this, Fill);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Fill).apply(this, arguments));
    _this.occurrence = ++occurrences;
    return _this;
  }

  _createClass(Fill, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$context$registe = this.context.registerFill,
          registerFill = _this$context$registe === void 0 ? noop : _this$context$registe;
      registerFill(this.props.name, this);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      if (!this.occurrence) {
        this.occurrence = ++occurrences;
      }

      var _this$context$getSlot = this.context.getSlot,
          getSlot = _this$context$getSlot === void 0 ? noop : _this$context$getSlot;
      var slot = getSlot(this.props.name);

      if (slot && !slot.props.bubblesVirtually) {
        slot.forceUpdate();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$context$unregis = this.context.unregisterFill,
          unregisterFill = _this$context$unregis === void 0 ? noop : _this$context$unregis;
      unregisterFill(this.props.name, this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var name = this.props.name;
      var _this$context = this.context,
          _this$context$unregis2 = _this$context.unregisterFill,
          unregisterFill = _this$context$unregis2 === void 0 ? noop : _this$context$unregis2,
          _this$context$registe2 = _this$context.registerFill,
          registerFill = _this$context$registe2 === void 0 ? noop : _this$context$registe2;

      if (prevProps.name !== name) {
        unregisterFill(prevProps.name, this);
        registerFill(name, this);
      }
    }
  }, {
    key: "resetOccurrence",
    value: function resetOccurrence() {
      this.occurrence = null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$context$getSlot2 = this.context.getSlot,
          getSlot = _this$context$getSlot2 === void 0 ? noop : _this$context$getSlot2;
      var name = this.props.name;
      var children = this.props.children;
      var slot = getSlot(name);

      if (!slot || !slot.props.bubblesVirtually) {
        return null;
      } // If a function is passed as a child, provide it with the fillProps.


      if (isFunction(children)) {
        children = children(slot.props.fillProps);
      }

      return createPortal(children, slot.node);
    }
  }]);

  return Fill;
}(Component);

Fill.contextTypes = {
  getSlot: noop,
  registerFill: noop,
  unregisterFill: noop
};
export default Fill;