import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import "core-js/modules/es6.function.name";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { flowRight, upperFirst, camelCase } from 'lodash';
import { Component } from 'react';
/**
 * WordPress dependencies
 */

import deprecated from '@wordpress/deprecated';
import isShallowEqual from '@wordpress/is-shallow-equal';
export function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName) {
  deprecated('wp.element.createHigherOrderComponent', {
    version: '3.5',
    alternative: 'wp.compose.createHigherOrderComponent'
  });
  return function (OriginalComponent) {
    var EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    var _OriginalComponent$di = OriginalComponent.displayName,
        displayName = _OriginalComponent$di === void 0 ? OriginalComponent.name || 'Component' : _OriginalComponent$di;
    EnhancedComponent.displayName = "".concat(upperFirst(camelCase(modifierName)), "(").concat(displayName, ")");
    return EnhancedComponent;
  };
}
export var compose = function compose() {
  deprecated('wp.element.compose', {
    version: '3.5',
    alternative: 'wp.compose.compose'
  });
  return flowRight.apply(void 0, arguments);
};
export var pure = function pure(Wrapped) {
  deprecated('wp.element.pure', {
    version: '3.5',
    alternative: 'wp.compose.pure'
  });

  if (Wrapped.prototype instanceof Component) {
    return (
      /*#__PURE__*/
      function (_Wrapped) {
        _inherits(_class, _Wrapped);

        function _class() {
          _classCallCheck(this, _class);

          return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        }

        _createClass(_class, [{
          key: "shouldComponentUpdate",
          value: function shouldComponentUpdate(nextProps, nextState) {
            return !isShallowEqual(nextProps, this.props) || !isShallowEqual(nextState, this.state);
          }
        }]);

        return _class;
      }(Wrapped)
    );
  }

  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(_class2, _Component);

      function _class2() {
        _classCallCheck(this, _class2);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class2).apply(this, arguments));
      }

      _createClass(_class2, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
          return !isShallowEqual(nextProps, this.props);
        }
      }, {
        key: "render",
        value: function render() {
          return createElement(Wrapped, this.props);
        }
      }]);

      return _class2;
    }(Component)
  );
};