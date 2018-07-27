import "core-js/modules/es6.function.name";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";

/**
 * External dependencies
 */
import { pick, sortBy, forEach, without, noop } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';

var SlotFillProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(SlotFillProvider, _Component);

  function SlotFillProvider() {
    var _this;

    _classCallCheck(this, SlotFillProvider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SlotFillProvider).apply(this, arguments));
    _this.registerSlot = _this.registerSlot.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.registerFill = _this.registerFill.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.unregisterSlot = _this.unregisterSlot.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.unregisterFill = _this.unregisterFill.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getSlot = _this.getSlot.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getFills = _this.getFills.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.slots = {};
    _this.fills = {};
    return _this;
  }

  _createClass(SlotFillProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return pick(this, ['registerSlot', 'registerFill', 'unregisterSlot', 'unregisterFill', 'getSlot', 'getFills']);
    }
  }, {
    key: "registerSlot",
    value: function registerSlot(name, slot) {
      this.slots[name] = slot;
      this.forceUpdateFills(name); // Sometimes the fills are registered after the initial render of slot
      // But before the registerSlot call, we need to rerender the slot

      this.forceUpdateSlot(name);
    }
  }, {
    key: "registerFill",
    value: function registerFill(name, instance) {
      this.fills[name] = _toConsumableArray(this.fills[name] || []).concat([instance]);
      this.forceUpdateSlot(name);
    }
  }, {
    key: "unregisterSlot",
    value: function unregisterSlot(name) {
      delete this.slots[name];
      this.forceUpdateFills(name);
    }
  }, {
    key: "unregisterFill",
    value: function unregisterFill(name, instance) {
      this.fills[name] = without(this.fills[name], instance);
      this.resetFillOccurrence(name);
      this.forceUpdateSlot(name);
    }
  }, {
    key: "getSlot",
    value: function getSlot(name) {
      return this.slots[name];
    }
  }, {
    key: "getFills",
    value: function getFills(name) {
      return sortBy(this.fills[name], 'occurrence');
    }
  }, {
    key: "resetFillOccurrence",
    value: function resetFillOccurrence(name) {
      forEach(this.fills[name], function (instance) {
        instance.resetOccurrence();
      });
    }
  }, {
    key: "forceUpdateFills",
    value: function forceUpdateFills(name) {
      forEach(this.fills[name], function (instance) {
        instance.forceUpdate();
      });
    }
  }, {
    key: "forceUpdateSlot",
    value: function forceUpdateSlot(name) {
      var slot = this.getSlot(name);

      if (slot) {
        slot.forceUpdate();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return SlotFillProvider;
}(Component);

SlotFillProvider.childContextTypes = {
  registerSlot: noop,
  unregisterSlot: noop,
  registerFill: noop,
  unregisterFill: noop,
  getSlot: noop,
  getFills: noop
};
export default SlotFillProvider;