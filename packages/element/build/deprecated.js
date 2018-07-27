"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHigherOrderComponent = createHigherOrderComponent;
exports.pure = exports.compose = void 0;

var _element = require("@wordpress/element");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

require("core-js/modules/es6.function.name");

var _lodash = require("lodash");

var _react = require("react");

var _deprecated = _interopRequireDefault(require("@wordpress/deprecated"));

var _isShallowEqual = _interopRequireDefault(require("@wordpress/is-shallow-equal"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName) {
  (0, _deprecated.default)('wp.element.createHigherOrderComponent', {
    version: '3.5',
    alternative: 'wp.compose.createHigherOrderComponent'
  });
  return function (OriginalComponent) {
    var EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    var _OriginalComponent$di = OriginalComponent.displayName,
        displayName = _OriginalComponent$di === void 0 ? OriginalComponent.name || 'Component' : _OriginalComponent$di;
    EnhancedComponent.displayName = "".concat((0, _lodash.upperFirst)((0, _lodash.camelCase)(modifierName)), "(").concat(displayName, ")");
    return EnhancedComponent;
  };
}

var compose = function compose() {
  (0, _deprecated.default)('wp.element.compose', {
    version: '3.5',
    alternative: 'wp.compose.compose'
  });
  return _lodash.flowRight.apply(void 0, arguments);
};

exports.compose = compose;

var pure = function pure(Wrapped) {
  (0, _deprecated.default)('wp.element.pure', {
    version: '3.5',
    alternative: 'wp.compose.pure'
  });

  if (Wrapped.prototype instanceof _react.Component) {
    return (
      /*#__PURE__*/
      function (_Wrapped) {
        (0, _inherits2.default)(_class, _Wrapped);

        function _class() {
          (0, _classCallCheck2.default)(this, _class);
          return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
        }

        (0, _createClass2.default)(_class, [{
          key: "shouldComponentUpdate",
          value: function shouldComponentUpdate(nextProps, nextState) {
            return !(0, _isShallowEqual.default)(nextProps, this.props) || !(0, _isShallowEqual.default)(nextState, this.state);
          }
        }]);
        return _class;
      }(Wrapped)
    );
  }

  return (
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(_class2, _Component);

      function _class2() {
        (0, _classCallCheck2.default)(this, _class2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class2).apply(this, arguments));
      }

      (0, _createClass2.default)(_class2, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
          return !(0, _isShallowEqual.default)(nextProps, this.props);
        }
      }, {
        key: "render",
        value: function render() {
          return (0, _element.createElement)(Wrapped, this.props);
        }
      }]);
      return _class2;
    }(_react.Component)
  );
};

exports.pure = pure;