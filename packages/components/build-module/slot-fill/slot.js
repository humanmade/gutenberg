import "core-js/modules/es6.function.name";
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
import { noop, map, isString, isFunction } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, Children, cloneElement } from '@wordpress/element';

var Slot =
/*#__PURE__*/
function (_Component) {
  _inherits(Slot, _Component);

  function Slot() {
    var _this;

    _classCallCheck(this, Slot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slot).apply(this, arguments));
    _this.bindNode = _this.bindNode.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Slot, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$context$registe = this.context.registerSlot,
          registerSlot = _this$context$registe === void 0 ? noop : _this$context$registe;
      registerSlot(this.props.name, this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$context$unregis = this.context.unregisterSlot,
          unregisterSlot = _this$context$unregis === void 0 ? noop : _this$context$unregis;
      unregisterSlot(this.props.name, this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var name = this.props.name;
      var _this$context = this.context,
          _this$context$unregis2 = _this$context.unregisterSlot,
          unregisterSlot = _this$context$unregis2 === void 0 ? noop : _this$context$unregis2,
          _this$context$registe2 = _this$context.registerSlot,
          registerSlot = _this$context$registe2 === void 0 ? noop : _this$context$registe2;

      if (prevProps.name !== name) {
        unregisterSlot(prevProps.name);
        registerSlot(name, this);
      }
    }
  }, {
    key: "bindNode",
    value: function bindNode(node) {
      this.node = node;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          name = _this$props.name,
          _this$props$bubblesVi = _this$props.bubblesVirtually,
          bubblesVirtually = _this$props$bubblesVi === void 0 ? false : _this$props$bubblesVi,
          _this$props$fillProps = _this$props.fillProps,
          fillProps = _this$props$fillProps === void 0 ? {} : _this$props$fillProps;
      var _this$context$getFill = this.context.getFills,
          getFills = _this$context$getFill === void 0 ? noop : _this$context$getFill;

      if (bubblesVirtually) {
        return createElement("div", {
          ref: this.bindNode
        });
      }

      var fills = map(getFills(name), function (fill) {
        var fillKey = fill.occurrence;
        var fillChildren = isFunction(fill.props.children) ? fill.props.children(fillProps) : fill.props.children;
        return Children.map(fillChildren, function (child, childIndex) {
          if (!child || isString(child)) {
            return child;
          }

          var childKey = "".concat(fillKey, "---").concat(child.key || childIndex);
          return cloneElement(child, {
            key: childKey
          });
        });
      });
      return createElement("div", {
        ref: this.bindNode,
        role: "presentation"
      }, isFunction(children) ? children(fills.filter(Boolean)) : fills);
    }
  }]);

  return Slot;
}(Component);

Slot.contextTypes = {
  registerSlot: noop,
  unregisterSlot: noop,
  getFills: noop
};
export default Slot;