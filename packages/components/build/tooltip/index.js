"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _lodash = require("lodash");

var _popover = _interopRequireDefault(require("../popover"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Time over children to wait before showing tooltip
 *
 * @type {Number}
 */
var TOOLTIP_DELAY = 700;

var Tooltip =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Tooltip, _Component);

  function Tooltip() {
    var _this;

    (0, _classCallCheck2.default)(this, Tooltip);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Tooltip).apply(this, arguments));
    _this.bindNode = _this.bindNode.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.delayedSetIsOver = (0, _lodash.debounce)(function (isOver) {
      return _this.setState({
        isOver: isOver
      });
    }, TOOLTIP_DELAY);
    _this.state = {
      isOver: false
    };
    return _this;
  }

  (0, _createClass2.default)(Tooltip, [{
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
      this.node = (0, _element.findDOMNode)(ref);
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
        var _ref2 = (0, _slicedToArray2.default)(_ref, 1),
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

      if (_element.Children.count(children) !== 1) {
        return;
      }

      var child = _element.Children.only(children);

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

        var isOver = (0, _lodash.includes)(['focus', 'mouseenter'], event.type);

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

      if (_element.Children.count(children) !== 1) {
        if ('development' === process.env.NODE_ENV) {
          // eslint-disable-next-line no-console
          console.error('Tooltip should be called with only a single child element.');
        }

        return children;
      }

      var child = _element.Children.only(children);

      var isOver = this.state.isOver;
      return (0, _element.cloneElement)(child, {
        ref: this.bindNode,
        onMouseEnter: this.createToggleIsOver('onMouseEnter', true),
        onMouseLeave: this.createToggleIsOver('onMouseLeave'),
        onClick: this.createToggleIsOver('onClick'),
        onFocus: this.createToggleIsOver('onFocus'),
        onBlur: this.createToggleIsOver('onBlur'),
        children: (0, _element.concatChildren)(child.props.children, isOver && (0, _element.createElement)(_popover.default, {
          focusOnMount: false,
          position: position,
          className: "components-tooltip",
          "aria-hidden": "true"
        }, text, shortcut && (0, _element.createElement)("span", {
          className: "components-tooltip__shortcut"
        }, shortcut)))
      });
    }
  }]);
  return Tooltip;
}(_element.Component);

var _default = Tooltip;
exports.default = _default;