"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

require("core-js/modules/es6.function.name");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
var Slot =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Slot, _Component);

  function Slot() {
    var _this;

    (0, _classCallCheck2.default)(this, Slot);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Slot).apply(this, arguments));
    _this.bindNode = _this.bindNode.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(Slot, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$context$registe = this.context.registerSlot,
          registerSlot = _this$context$registe === void 0 ? _lodash.noop : _this$context$registe;
      registerSlot(this.props.name, this);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$context$unregis = this.context.unregisterSlot,
          unregisterSlot = _this$context$unregis === void 0 ? _lodash.noop : _this$context$unregis;
      unregisterSlot(this.props.name, this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var name = this.props.name;
      var _this$context = this.context,
          _this$context$unregis2 = _this$context.unregisterSlot,
          unregisterSlot = _this$context$unregis2 === void 0 ? _lodash.noop : _this$context$unregis2,
          _this$context$registe2 = _this$context.registerSlot,
          registerSlot = _this$context$registe2 === void 0 ? _lodash.noop : _this$context$registe2;

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
          getFills = _this$context$getFill === void 0 ? _lodash.noop : _this$context$getFill;

      if (bubblesVirtually) {
        return (0, _element.createElement)("div", {
          ref: this.bindNode
        });
      }

      var fills = (0, _lodash.map)(getFills(name), function (fill) {
        var fillKey = fill.occurrence;
        var fillChildren = (0, _lodash.isFunction)(fill.props.children) ? fill.props.children(fillProps) : fill.props.children;
        return _element.Children.map(fillChildren, function (child, childIndex) {
          if (!child || (0, _lodash.isString)(child)) {
            return child;
          }

          var childKey = "".concat(fillKey, "---").concat(child.key || childIndex);
          return (0, _element.cloneElement)(child, {
            key: childKey
          });
        });
      });
      return (0, _element.createElement)("div", {
        ref: this.bindNode,
        role: "presentation"
      }, (0, _lodash.isFunction)(children) ? children(fills.filter(Boolean)) : fills);
    }
  }]);
  return Slot;
}(_element.Component);

Slot.contextTypes = {
  registerSlot: _lodash.noop,
  unregisterSlot: _lodash.noop,
  getFills: _lodash.noop
};
var _default = Slot;
exports.default = _default;