import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { noop } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
export default (function (contextName) {
  return function (mapSettingsToProps) {
    return createHigherOrderComponent(function (OriginalComponent) {
      var WrappedComponent =
      /*#__PURE__*/
      function (_Component) {
        _inherits(WrappedComponent, _Component);

        function WrappedComponent() {
          _classCallCheck(this, WrappedComponent);

          return _possibleConstructorReturn(this, _getPrototypeOf(WrappedComponent).apply(this, arguments));
        }

        _createClass(WrappedComponent, [{
          key: "render",
          value: function render() {
            var extraProps = mapSettingsToProps ? mapSettingsToProps(this.context[contextName], this.props) : _defineProperty({}, contextName, this.context[contextName]);
            return createElement(OriginalComponent, _extends({}, this.props, extraProps));
          }
        }]);

        return WrappedComponent;
      }(Component);

      WrappedComponent.contextTypes = _defineProperty({}, contextName, noop);
      return WrappedComponent;
    }, 'withContext');
  };
});