import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
/**
 * Internal dependencies
 */

import Dashicon from '../dashicon';

var DropZone =
/*#__PURE__*/
function (_Component) {
  _inherits(DropZone, _Component);

  function DropZone() {
    var _this;

    _classCallCheck(this, DropZone);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DropZone).apply(this, arguments));
    _this.setZoneNode = _this.setZoneNode.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      isDraggingOverDocument: false,
      isDraggingOverElement: false,
      position: null,
      type: null
    };
    return _this;
  }

  _createClass(DropZone, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.dropzones.add({
        element: this.zone,
        updateState: this.setState.bind(this),
        onDrop: this.props.onDrop,
        onFilesDrop: this.props.onFilesDrop,
        onHTMLDrop: this.props.onHTMLDrop
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.dropzones.remove(this.zone);
    }
  }, {
    key: "setZoneNode",
    value: function setZoneNode(node) {
      this.zone = node;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          label = _this$props.label;
      var _this$state = this.state,
          isDraggingOverDocument = _this$state.isDraggingOverDocument,
          isDraggingOverElement = _this$state.isDraggingOverElement,
          position = _this$state.position,
          type = _this$state.type;
      var classes = classnames('components-drop-zone', className, _defineProperty({
        'is-active': isDraggingOverDocument || isDraggingOverElement,
        'is-dragging-over-document': isDraggingOverDocument,
        'is-dragging-over-element': isDraggingOverElement,
        'is-close-to-top': position && position.y === 'top',
        'is-close-to-bottom': position && position.y === 'bottom',
        'is-close-to-left': position && position.x === 'left',
        'is-close-to-right': position && position.x === 'right'
      }, "is-dragging-".concat(type), !!type));
      return createElement("div", {
        ref: this.setZoneNode,
        className: classes
      }, createElement("div", {
        className: "components-drop-zone__content"
      }, [createElement(Dashicon, {
        key: "icon",
        icon: "upload",
        size: "40",
        className: "components-drop-zone__content-icon"
      }), createElement("span", {
        key: "text",
        className: "components-drop-zone__content-text"
      }, label ? label : __('Drop files to upload'))]));
    }
  }]);

  return DropZone;
}(Component);

DropZone.contextTypes = {
  dropzones: noop
};
export default DropZone;