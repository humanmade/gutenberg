import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import "core-js/modules/es6.array.find";
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
import { noop } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, createRef } from '@wordpress/element';
import deprecated from '@wordpress/deprecated';
import { focus as _focus } from '@wordpress/dom';
import { ESCAPE } from '@wordpress/keycodes';
/**
 * Internal dependencies
 */

import { computePopoverPosition as _computePopoverPosition } from './utils';
import withFocusReturn from '../higher-order/with-focus-return';
import withConstrainedTabbing from '../higher-order/with-constrained-tabbing';
import PopoverDetectOutside from './detect-outside';
import IconButton from '../icon-button';
import ScrollLock from '../scroll-lock';
import { Slot, Fill } from '../slot-fill';
var FocusManaged = withConstrainedTabbing(withFocusReturn(function (_ref) {
  var children = _ref.children;
  return children;
}));
/**
 * Name of slot in which popover should fill.
 *
 * @type {String}
 */

var SLOT_NAME = 'Popover';

var Popover =
/*#__PURE__*/
function (_Component) {
  _inherits(Popover, _Component);

  function Popover() {
    var _this;

    _classCallCheck(this, Popover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Popover).apply(this, arguments));
    _this.focus = _this.focus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getAnchorRect = _this.getAnchorRect.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updatePopoverSize = _this.updatePopoverSize.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.computePopoverPosition = _this.computePopoverPosition.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.throttledComputePopoverPosition = _this.throttledComputePopoverPosition.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.maybeClose = _this.maybeClose.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.contentNode = createRef();
    _this.anchorNode = createRef();
    _this.state = {
      popoverLeft: null,
      popoverTop: null,
      yAxis: 'top',
      xAxis: 'center',
      contentHeight: null,
      contentWidth: null,
      isMobile: false,
      popoverSize: null
    };
    return _this;
  }

  _createClass(Popover, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.toggleWindowEvents(true);
      this.refresh();
      this.focus();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.position !== this.props.position) {
        this.computePopoverPosition();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.toggleWindowEvents(false);
    }
  }, {
    key: "toggleWindowEvents",
    value: function toggleWindowEvents(isListening) {
      var handler = isListening ? 'addEventListener' : 'removeEventListener';
      window.cancelAnimationFrame(this.rafHandle);
      window[handler]('resize', this.throttledComputePopoverPosition);
      window[handler]('scroll', this.throttledComputePopoverPosition, true);
    }
  }, {
    key: "throttledComputePopoverPosition",
    value: function throttledComputePopoverPosition(event) {
      var _this2 = this;

      if (event.type === 'scroll' && this.contentNode.current.contains(event.target)) {
        return;
      }

      this.rafHandle = window.requestAnimationFrame(function () {
        return _this2.computePopoverPosition();
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      var popoverSize = this.updatePopoverSize();
      this.computePopoverPosition(popoverSize);
    }
  }, {
    key: "focus",
    value: function focus() {
      var focusOnMount = this.props.focusOnMount;

      if (focusOnMount === true) {
        deprecated('focusOnMount={ true }', {
          version: '3.4',
          alternative: 'focusOnMount="firstElement"',
          plugin: 'Gutenberg'
        });
      }

      if (!focusOnMount || !this.contentNode.current) {
        return;
      } // Without the setTimeout, the dom node is not being focused
      // Related https://stackoverflow.com/questions/35522220/react-ref-with-focus-doesnt-work-without-settimeout-my-example


      var focusNode = function focusNode(domNode) {
        return setTimeout(function () {
          return domNode.focus();
        });
      }; // Boolean values for focusOnMount deprecated in 3.2–remove
      // `focusOnMount === true` check in 3.4.


      if (focusOnMount === 'firstElement' || focusOnMount === true) {
        // Find first tabbable node within content and shift focus, falling
        // back to the popover panel itself.
        var firstTabbable = _focus.tabbable.find(this.contentNode.current)[0];

        focusNode(firstTabbable ? firstTabbable : this.contentNode.current);
        return;
      }

      if (focusOnMount === 'container') {
        // Focus the popover panel itself so items in the popover are easily
        // accessed via keyboard navigation.
        focusNode(this.contentNode.current);
        return;
      }

      window.console.warn("<Popover> component: focusOnMount argument \"".concat(focusOnMount, "\" not recognized."));
    }
  }, {
    key: "getAnchorRect",
    value: function getAnchorRect() {
      var anchor = this.anchorNode.current;

      if (!anchor || !anchor.parentNode) {
        return;
      }

      var rect = anchor.parentNode.getBoundingClientRect(); // subtract padding

      var _window$getComputedSt = window.getComputedStyle(anchor.parentNode),
          paddingTop = _window$getComputedSt.paddingTop,
          paddingBottom = _window$getComputedSt.paddingBottom;

      var topPad = parseInt(paddingTop, 10);
      var bottomPad = parseInt(paddingBottom, 10);
      return {
        x: rect.left,
        y: rect.top + topPad,
        width: rect.width,
        height: rect.height - topPad - bottomPad,
        left: rect.left,
        right: rect.right,
        top: rect.top + topPad,
        bottom: rect.bottom - bottomPad
      };
    }
  }, {
    key: "updatePopoverSize",
    value: function updatePopoverSize() {
      var rect = this.contentNode.current.getBoundingClientRect();

      if (!this.state.popoverSize || rect.width !== this.state.popoverSize.width || rect.height !== this.state.popoverSize.height) {
        var popoverSize = {
          height: rect.height,
          width: rect.width
        };
        this.setState({
          popoverSize: popoverSize
        });
        return popoverSize;
      }

      return this.state.popoverSize;
    }
  }, {
    key: "computePopoverPosition",
    value: function computePopoverPosition(popoverSize) {
      var _this$props = this.props,
          _this$props$getAnchor = _this$props.getAnchorRect,
          getAnchorRect = _this$props$getAnchor === void 0 ? this.getAnchorRect : _this$props$getAnchor,
          _this$props$position = _this$props.position,
          position = _this$props$position === void 0 ? 'top' : _this$props$position,
          expandOnMobile = _this$props.expandOnMobile;

      var newPopoverPosition = _computePopoverPosition(getAnchorRect(), popoverSize || this.state.popoverSize, position, expandOnMobile);

      if (this.state.yAxis !== newPopoverPosition.yAxis || this.state.xAxis !== newPopoverPosition.xAxis || this.state.popoverLeft !== newPopoverPosition.popoverLeft || this.state.popoverTop !== newPopoverPosition.popoverTop || this.state.contentHeight !== newPopoverPosition.contentHeight || this.state.contentWidth !== newPopoverPosition.contentWidth || this.state.isMobile !== newPopoverPosition.isMobile) {
        this.setState(newPopoverPosition);
      }
    }
  }, {
    key: "maybeClose",
    value: function maybeClose(event) {
      var _this$props2 = this.props,
          onKeyDown = _this$props2.onKeyDown,
          onClose = _this$props2.onClose; // Close on escape

      if (event.keyCode === ESCAPE && onClose) {
        event.stopPropagation();
        onClose();
      } // Preserve original content prop behavior


      if (onKeyDown) {
        onKeyDown(event);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props3 = this.props,
          headerTitle = _this$props3.headerTitle,
          onClose = _this$props3.onClose,
          children = _this$props3.children,
          className = _this$props3.className,
          _this$props3$onClickO = _this$props3.onClickOutside,
          onClickOutside = _this$props3$onClickO === void 0 ? onClose : _this$props3$onClickO,
          noArrow = _this$props3.noArrow,
          position = _this$props3.position,
          range = _this$props3.range,
          focusOnMount = _this$props3.focusOnMount,
          getAnchorRect = _this$props3.getAnchorRect,
          expandOnMobile = _this$props3.expandOnMobile,
          contentProps = _objectWithoutProperties(_this$props3, ["headerTitle", "onClose", "children", "className", "onClickOutside", "noArrow", "position", "range", "focusOnMount", "getAnchorRect", "expandOnMobile"]);

      var _this$state = this.state,
          popoverLeft = _this$state.popoverLeft,
          popoverTop = _this$state.popoverTop,
          yAxis = _this$state.yAxis,
          xAxis = _this$state.xAxis,
          contentHeight = _this$state.contentHeight,
          contentWidth = _this$state.contentWidth,
          popoverSize = _this$state.popoverSize,
          isMobile = _this$state.isMobile;
      var classes = classnames('components-popover', className, 'is-' + yAxis, 'is-' + xAxis, {
        'is-mobile': isMobile,
        'no-arrow': noArrow || xAxis === 'center' && yAxis === 'middle'
      }); // Disable reason: We care to capture the _bubbled_ events from inputs
      // within popover as inferring close intent.

      /* eslint-disable jsx-a11y/no-static-element-interactions */

      var content = createElement(PopoverDetectOutside, {
        onClickOutside: onClickOutside
      }, createElement("div", _extends({
        className: classes,
        style: {
          top: !isMobile && popoverTop ? popoverTop + 'px' : undefined,
          left: !isMobile && popoverLeft ? popoverLeft + 'px' : undefined,
          visibility: popoverSize ? undefined : 'hidden'
        }
      }, contentProps, {
        onKeyDown: this.maybeClose
      }), isMobile && createElement("div", {
        className: "components-popover__header"
      }, createElement("span", {
        className: "components-popover__header-title"
      }, headerTitle), createElement(IconButton, {
        className: "components-popover__close",
        icon: "no-alt",
        onClick: onClose
      })), createElement("div", {
        ref: this.contentNode,
        className: "components-popover__content",
        style: {
          maxHeight: !isMobile && contentHeight ? contentHeight + 'px' : undefined,
          maxWidth: !isMobile && contentWidth ? contentWidth + 'px' : undefined
        },
        tabIndex: "-1"
      }, children)));
      /* eslint-enable jsx-a11y/no-static-element-interactions */
      // Apply focus to element as long as focusOnMount is truthy; false is
      // the only "disabled" value.

      if (focusOnMount) {
        content = createElement(FocusManaged, null, content);
      } // In case there is no slot context in which to render, default to an
      // in-place rendering.


      var getSlot = this.context.getSlot;

      if (getSlot && getSlot(SLOT_NAME)) {
        content = createElement(Fill, {
          name: SLOT_NAME
        }, content);
      }

      return createElement("span", {
        ref: this.anchorNode
      }, content, isMobile && expandOnMobile && createElement(ScrollLock, null));
    }
  }]);

  return Popover;
}(Component);

Popover.defaultProps = {
  focusOnMount: 'firstElement',
  noArrow: false
};
var PopoverContainer = Popover;
PopoverContainer.contextTypes = {
  getSlot: noop
};

PopoverContainer.Slot = function () {
  return createElement(Slot, {
    bubblesVirtually: true,
    name: SLOT_NAME
  });
};

export default PopoverContainer;