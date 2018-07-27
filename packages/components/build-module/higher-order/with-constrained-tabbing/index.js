import "core-js/modules/es6.array.find";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { Component, createRef } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import { TAB } from '@wordpress/keycodes';
import { focus } from '@wordpress/dom';
var withConstrainedTabbing = createHigherOrderComponent(function (WrappedComponent) {
  return (
    /*#__PURE__*/
    function (_Component) {
      _inherits(_class, _Component);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
        _this.focusContainRef = createRef();
        _this.handleTabBehaviour = _this.handleTabBehaviour.bind(_assertThisInitialized(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(_class, [{
        key: "handleTabBehaviour",
        value: function handleTabBehaviour(event) {
          if (event.keyCode !== TAB) {
            return;
          }

          var tabbables = focus.tabbable.find(this.focusContainRef.current);

          if (!tabbables.length) {
            return;
          }

          var firstTabbable = tabbables[0];
          var lastTabbable = tabbables[tabbables.length - 1];

          if (event.shiftKey && event.target === firstTabbable) {
            event.preventDefault();
            lastTabbable.focus();
          } else if (!event.shiftKey && event.target === lastTabbable) {
            event.preventDefault();
            firstTabbable.focus();
          }
        }
      }, {
        key: "render",
        value: function render() {
          // Disable reason: this component is non-interactive, but must capture
          // events from the wrapped component to determine when the Tab key is used.

          /* eslint-disable jsx-a11y/no-static-element-interactions */
          return createElement("div", {
            onKeyDown: this.handleTabBehaviour,
            ref: this.focusContainRef
          }, createElement(WrappedComponent, this.props));
          /* eslint-enable jsx-a11y/no-static-element-interactions */
        }
      }]);

      return _class;
    }(Component)
  );
}, 'withConstrainedTabbing');
export default withConstrainedTabbing;