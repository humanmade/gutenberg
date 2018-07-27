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
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Button from '../button';
import Dashicon from '../dashicon';

var PanelBody =
/*#__PURE__*/
function (_Component) {
  _inherits(PanelBody, _Component);

  function PanelBody(props) {
    var _this;

    _classCallCheck(this, PanelBody);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PanelBody).apply(this, arguments));
    _this.state = {
      opened: props.initialOpen === undefined ? true : props.initialOpen
    };
    _this.toggle = _this.toggle.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(PanelBody, [{
    key: "toggle",
    value: function toggle(event) {
      event.preventDefault();

      if (this.props.opened === undefined) {
        this.setState(function (state) {
          return {
            opened: !state.opened
          };
        });
      }

      if (this.props.onToggle) {
        this.props.onToggle();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          children = _this$props.children,
          opened = _this$props.opened,
          className = _this$props.className,
          icon = _this$props.icon;
      var isOpened = opened === undefined ? this.state.opened : opened;
      var arrow = "arrow-".concat(isOpened ? 'up' : 'down');
      var classes = classnames('components-panel__body', className, {
        'is-opened': isOpened
      });
      return createElement("div", {
        className: classes
      }, !!title && createElement("h2", {
        className: "components-panel__body-title"
      }, createElement(Button, {
        className: "components-panel__body-toggle",
        onClick: this.toggle,
        "aria-expanded": isOpened
      }, createElement(Dashicon, {
        icon: arrow,
        className: "components-panel__arrow"
      }), icon && createElement(Dashicon, {
        icon: icon,
        className: "components-panel__icon"
      }), title)), isOpened && children);
    }
  }]);

  return PanelBody;
}(Component);

export default PanelBody;