"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _compose = require("@wordpress/compose");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
var _default = function _default(contextName) {
  return function (mapSettingsToProps) {
    return (0, _compose.createHigherOrderComponent)(function (OriginalComponent) {
      var WrappedComponent =
      /*#__PURE__*/
      function (_Component) {
        (0, _inherits2.default)(WrappedComponent, _Component);

        function WrappedComponent() {
          (0, _classCallCheck2.default)(this, WrappedComponent);
          return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(WrappedComponent).apply(this, arguments));
        }

        (0, _createClass2.default)(WrappedComponent, [{
          key: "render",
          value: function render() {
            var extraProps = mapSettingsToProps ? mapSettingsToProps(this.context[contextName], this.props) : (0, _defineProperty2.default)({}, contextName, this.context[contextName]);
            return (0, _element.createElement)(OriginalComponent, (0, _extends2.default)({}, this.props, extraProps));
          }
        }]);
        return WrappedComponent;
      }(_element.Component);

      WrappedComponent.contextTypes = (0, _defineProperty2.default)({}, contextName, _lodash.noop);
      return WrappedComponent;
    }, 'withContext');
  };
};

exports.default = _default;