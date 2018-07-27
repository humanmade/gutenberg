"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

var _i18n = require("@wordpress/i18n");

var _dashicon = _interopRequireDefault(require("../dashicon"));

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
var DropZone =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(DropZone, _Component);

  function DropZone() {
    var _this;

    (0, _classCallCheck2.default)(this, DropZone);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(DropZone).apply(this, arguments));
    _this.setZoneNode = _this.setZoneNode.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.state = {
      isDraggingOverDocument: false,
      isDraggingOverElement: false,
      position: null,
      type: null
    };
    return _this;
  }

  (0, _createClass2.default)(DropZone, [{
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
      var classes = (0, _classnames2.default)('components-drop-zone', className, (0, _defineProperty2.default)({
        'is-active': isDraggingOverDocument || isDraggingOverElement,
        'is-dragging-over-document': isDraggingOverDocument,
        'is-dragging-over-element': isDraggingOverElement,
        'is-close-to-top': position && position.y === 'top',
        'is-close-to-bottom': position && position.y === 'bottom',
        'is-close-to-left': position && position.x === 'left',
        'is-close-to-right': position && position.x === 'right'
      }, "is-dragging-".concat(type), !!type));
      return (0, _element.createElement)("div", {
        ref: this.setZoneNode,
        className: classes
      }, (0, _element.createElement)("div", {
        className: "components-drop-zone__content"
      }, [(0, _element.createElement)(_dashicon.default, {
        key: "icon",
        icon: "upload",
        size: "40",
        className: "components-drop-zone__content-icon"
      }), (0, _element.createElement)("span", {
        key: "text",
        className: "components-drop-zone__content-text"
      }, label ? label : (0, _i18n.__)('Drop files to upload'))]));
    }
  }]);
  return DropZone;
}(_element.Component);

DropZone.contextTypes = {
  dropzones: _lodash.noop
};
var _default = DropZone;
exports.default = _default;