import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import createHigherOrderComponent from '../create-higher-order-component';
/**
 * Higher-order component creator, creating a new component that remounts
 * the wrapped component each time a given prop value changes.
 *
 * @param {string} propName Prop name to monitor.
 *
 * @return {Function} Higher-order component.
 */

var remountOnPropChange = function remountOnPropChange(propName) {
  return createHigherOrderComponent(function (WrappedComponent) {
    return (
      /*#__PURE__*/
      function (_Component) {
        _inherits(_class, _Component);

        function _class(props) {
          var _this;

          _classCallCheck(this, _class);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
          _this.state = {
            propChangeId: 0,
            propValue: props[propName]
          };
          return _this;
        }

        _createClass(_class, [{
          key: "render",
          value: function render() {
            return createElement(WrappedComponent, _extends({
              key: this.state.propChangeId
            }, this.props));
          }
        }], [{
          key: "getDerivedStateFromProps",
          value: function getDerivedStateFromProps(props, state) {
            if (props[propName] === state.propValue) {
              return null;
            }

            return {
              propChangeId: state.propChangeId + 1,
              propValue: props[propName]
            };
          }
        }]);

        return _class;
      }(Component)
    );
  }, 'remountOnPropChange');
};

export default remountOnPropChange;