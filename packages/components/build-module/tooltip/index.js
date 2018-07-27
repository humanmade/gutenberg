import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
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
import { debounce, includes } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, Children, cloneElement, findDOMNode, concatChildren } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Popover from '../popover';
/**
 * Time over children to wait before showing tooltip
 *
 * @type {Number}
 */

var TOOLTIP_DELAY = 700;

var Tooltip =
/*#__PURE__*/
function (_Component) {
  _inherits(Tooltip, _Component);

  function Tooltip() {
    var _this;

    _classCallCheck(this, Tooltip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tooltip).apply(this, arguments));
    _this.bindNode = _this.bindNode.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.delayedSetIsOver = debounce(function (isOver) {
      return _this.setState({
        isOver: isOver
      });
    }, TOOLTIP_DELAY);
    _this.state = {
      isOver: false
    };
    return _this;
  }

  _createClass(Tooltip, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.delayedSetIsOver.cancel();
      this.disconnectDisabledAttributeObserver();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var isOver = this.state.isOver;

      if (isOver !== prevState.isOver) {
        if (isOver) {
          this.observeDisabledAttribute();
        } else {
          this.disconnectDisabledAttributeObserver();
        }
      }
    }
    /**
     * Assigns DOM node of the rendered component as an instance property.
     *
     * @param {Element} ref Rendered component reference.
     */

  }, {
    key: "bindNode",
    value: function bindNode(ref) {
      // Disable reason: Because render clones the child, we don't know what
      // type of element we have, but if it's a DOM node, we want to observe
      // the disabled attribute.
      // eslint-disable-next-line react/no-find-dom-node
      this.node = findDOMNode(ref);
    }
    /**
     * Disconnects any DOM observer attached to the rendered node.
     */

  }, {
    key: "disconnectDisabledAttributeObserver",
    value: function disconnectDisabledAttributeObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
    /**
     * Adds a DOM observer to the rendered node, if supported and if the DOM
     * node exists, to monitor for application of a disabled attribute.
     */

  }, {
    key: "observeDisabledAttribute",
    value: function observeDisabledAttribute() {
      var _this2 = this;

      if (!window.MutationObserver || !this.node) {
        return;
      }

      this.observer = new window.MutationObserver(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            mutation = _ref2[0];

        if (mutation.target.disabled) {
          // We can assume here that isOver is true, because mutation
          // observer is only attached for duration of isOver active
          _this2.setState({
            isOver: false
          });
        }
      }); // Monitor changes to the disable attribute on the DOM node

      this.observer.observe(this.node, {
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
      });
    }
  }, {
    key: "emitToChild",
    value: function emitToChild(eventName, event) {
      var children = this.props.children;

      if (Children.count(children) !== 1) {
        return;
      }

      var child = Children.only(children);

      if (typeof child.props[eventName] === 'function') {
        child.props[eventName](event);
      }
    }
  }, {
    key: "createToggleIsOver",
    value: function createToggleIsOver(eventName, isDelayed) {
      var _this3 = this;

      return function (event) {
        // Preserve original child callback behavior
        _this3.emitToChild(eventName, event); // Mouse events behave unreliably in React for disabled elements,
        // firing on mouseenter but not mouseleave.  Further, the default
        // behavior for disabled elements in some browsers is to ignore
        // mouse events. Don't bother trying to to handle them.
        //
        // See: https://github.com/facebook/react/issues/4251


        if (event.currentTarget.disabled) {
          return;
        } // Needed in case unsetting is over while delayed set pending, i.e.
        // quickly blur/mouseleave before delayedSetIsOver is called


        _this3.delayedSetIsOver.cancel();

        var isOver = includes(['focus', 'mouseenter'], event.type);

        if (isOver === _this3.state.isOver) {
          return;
        }

        if (isDelayed) {
          _this3.delayedSetIsOver(isOver);
        } else {
          _this3.setState({
            isOver: isOver
          });
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          position = _this$props.position,
          text = _this$props.text,
          shortcut = _this$props.shortcut;

      if (Children.count(children) !== 1) {
        if ('development' === process.env.NODE_ENV) {
          // eslint-disable-next-line no-console
          console.error('Tooltip should be called with only a single child element.');
        }

        return children;
      }

      var child = Children.only(children);
      var isOver = this.state.isOver;
      return cloneElement(child, {
        ref: this.bindNode,
        onMouseEnter: this.createToggleIsOver('onMouseEnter', true),
        onMouseLeave: this.createToggleIsOver('onMouseLeave'),
        onClick: this.createToggleIsOver('onClick'),
        onFocus: this.createToggleIsOver('onFocus'),
        onBlur: this.createToggleIsOver('onBlur'),
        children: concatChildren(child.props.children, isOver && createElement(Popover, {
          focusOnMount: false,
          position: position,
          className: "components-tooltip",
          "aria-hidden": "true"
        }, text, shortcut && createElement("span", {
          className: "components-tooltip__shortcut"
        }, shortcut)))
      });
    }
  }]);

  return Tooltip;
}(Component);

export default Tooltip;