"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.function.name");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _element = require("@wordpress/element");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
var occurrences = 0;

var Fill =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Fill, _Component);

  function Fill() {
    var _this;

    (0, _classCallCheck2.default)(this, Fill);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Fill).apply(this, arguments));
    _this.occurrence = ++occurrences;
    return _this;
  }

  (0, _createClass2.default)(Fill, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$context$registe = this.context.registerFill,
          registerFill = _this$context$registe === void 0 ? _lodash.noop : _this$context$registe;
      registerFill(this.props.name, this);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate() {
      if (!this.occurrence) {
        this.occurrence = ++occurrences;
      }

      var _this$context$getSlot = this.context.getSlot,
          getSlot = _this$context$getSlot === void 0 ? _lodash.noop : _this$context$getSlot;
      var slot = getSlot(this.props.name);

      if (slot && !slot.props.bubblesVirtually) {
        slot.forceUpdate();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$context$unregis = this.context.unregisterFill,
          unregisterFill = _this$context$unregis === void 0 ? _lodash.noop : _this$context$unregis;
      unregisterFill(this.props.name, this);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var name = this.props.name;
      var _this$context = this.context,
          _this$context$unregis2 = _this$context.unregisterFill,
          unregisterFill = _this$context$unregis2 === void 0 ? _lodash.noop : _this$context$unregis2,
          _this$context$registe2 = _this$context.registerFill,
          registerFill = _this$context$registe2 === void 0 ? _lodash.noop : _this$context$registe2;

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
          getSlot = _this$context$getSlot2 === void 0 ? _lodash.noop : _this$context$getSlot2;
      var name = this.props.name;
      var children = this.props.children;
      var slot = getSlot(name);

      if (!slot || !slot.props.bubblesVirtually) {
        return null;
      } // If a function is passed as a child, provide it with the fillProps.


      if ((0, _lodash.isFunction)(children)) {
        children = children(slot.props.fillProps);
      }

      return (0, _element.createPortal)(children, slot.node);
    }
  }]);
  return Fill;
}(_element.Component);

Fill.contextTypes = {
  getSlot: _lodash.noop,
  registerFill: _lodash.noop,
  unregisterFill: _lodash.noop
};
var _default = Fill;
exports.default = _default;