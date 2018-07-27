import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/**
 * External dependencies
 */
import clickOutside from 'react-click-outside';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';

var PopoverDetectOutside =
/*#__PURE__*/
function (_Component) {
  _inherits(PopoverDetectOutside, _Component);

  function PopoverDetectOutside() {
    _classCallCheck(this, PopoverDetectOutside);

    return _possibleConstructorReturn(this, _getPrototypeOf(PopoverDetectOutside).apply(this, arguments));
  }

  _createClass(PopoverDetectOutside, [{
    key: "handleClickOutside",
    value: function handleClickOutside(event) {
      var onClickOutside = this.props.onClickOutside;

      if (onClickOutside) {
        onClickOutside(event);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return PopoverDetectOutside;
}(Component);

export default clickOutside(PopoverDetectOutside);