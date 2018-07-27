import _extends from "@babel/runtime/helpers/extends";
import "core-js/modules/web.dom.iterable";
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
import { without } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../create-higher-order-component';
/**
 * Browser dependencies
 */

var _window = window,
    _clearTimeout = _window.clearTimeout,
    _setTimeout = _window.setTimeout;
/**
 * A higher-order component used to provide and manage delayed function calls
 * that ought to be bound to a component's lifecycle.
 *
 * @param {Component} OriginalComponent Component requiring setTimeout
 *
 * @return {Component}                  Wrapped component.
 */

var withSafeTimeout = createHigherOrderComponent(function (OriginalComponent) {
  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(WrappedComponent, _Component);

      function WrappedComponent() {
        var _this;

        _classCallCheck(this, WrappedComponent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(WrappedComponent).apply(this, arguments));
        _this.timeouts = [];
        _this.setTimeout = _this.setTimeout.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        _this.clearTimeout = _this.clearTimeout.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(WrappedComponent, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.timeouts.forEach(_clearTimeout);
        }
      }, {
        key: "setTimeout",
        value: function setTimeout(fn, delay) {
          var _this2 = this;

          var id = _setTimeout(function () {
            fn();

            _this2.clearTimeout(id);
          }, delay);

          this.timeouts.push(id);
          return id;
        }
      }, {
        key: "clearTimeout",
        value: function clearTimeout(id) {
          _clearTimeout(id);

          this.timeouts = without(this.timeouts, id);
        }
      }, {
        key: "render",
        value: function render() {
          return createElement(OriginalComponent, _extends({}, this.props, {
            setTimeout: this.setTimeout,
            clearTimeout: this.clearTimeout
          }));
        }
      }]);

      return WrappedComponent;
    }(Component)
  );
}, 'withSafeTimeout');
export default withSafeTimeout;