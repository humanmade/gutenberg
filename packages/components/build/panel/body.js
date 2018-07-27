"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = _interopRequireDefault(require("../button"));

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
var PanelBody =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(PanelBody, _Component);

  function PanelBody(props) {
    var _this;

    (0, _classCallCheck2.default)(this, PanelBody);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(PanelBody).apply(this, arguments));
    _this.state = {
      opened: props.initialOpen === undefined ? true : props.initialOpen
    };
    _this.toggle = _this.toggle.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    return _this;
  }

  (0, _createClass2.default)(PanelBody, [{
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
      var classes = (0, _classnames.default)('components-panel__body', className, {
        'is-opened': isOpened
      });
      return (0, _element.createElement)("div", {
        className: classes
      }, !!title && (0, _element.createElement)("h2", {
        className: "components-panel__body-title"
      }, (0, _element.createElement)(_button.default, {
        className: "components-panel__body-toggle",
        onClick: this.toggle,
        "aria-expanded": isOpened
      }, (0, _element.createElement)(_dashicon.default, {
        icon: arrow,
        className: "components-panel__arrow"
      }), icon && (0, _element.createElement)(_dashicon.default, {
        icon: icon,
        className: "components-panel__icon"
      }), title)), isOpened && children);
    }
  }]);
  return PanelBody;
}(_element.Component);

var _default = PanelBody;
exports.default = _default;