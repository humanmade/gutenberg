import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isString, isArray } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Tooltip from '../tooltip';
import Button from '../button';
import Dashicon from '../dashicon'; // This is intentionally a Component class, not a function component because it
// is common to apply a ref to the button element (only supported in class)

var IconButton =
/*#__PURE__*/
function (_Component) {
  _inherits(IconButton, _Component);

  function IconButton() {
    _classCallCheck(this, IconButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(IconButton).apply(this, arguments));
  }

  _createClass(IconButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          icon = _this$props.icon,
          children = _this$props.children,
          label = _this$props.label,
          className = _this$props.className,
          tooltip = _this$props.tooltip,
          focus = _this$props.focus,
          shortcut = _this$props.shortcut,
          additionalProps = _objectWithoutProperties(_this$props, ["icon", "children", "label", "className", "tooltip", "focus", "shortcut"]);

      var classes = classnames('components-icon-button', className);
      var tooltipText = tooltip || label; // Should show the tooltip if...

      var showTooltip = // an explicit tooltip is passed or...
      tooltip || // there's a shortcut or...
      shortcut || // there's a label and...
      !!label && ( // the children are empty and...
      !children || isArray(children) && !children.length) && // the tooltip is not explicitly disabled.
      false !== tooltip;
      var element = createElement(Button, _extends({}, additionalProps, {
        "aria-label": label,
        className: classes,
        focus: focus
      }), isString(icon) ? createElement(Dashicon, {
        icon: icon
      }) : icon, children);

      if (showTooltip) {
        element = createElement(Tooltip, {
          text: tooltipText,
          shortcut: shortcut
        }, element);
      }

      return element;
    }
  }]);

  return IconButton;
}(Component);

export default IconButton;