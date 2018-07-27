import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
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
import { Component } from '@wordpress/element';

var TokenInput =
/*#__PURE__*/
function (_Component) {
  _inherits(TokenInput, _Component);

  function TokenInput() {
    var _this;

    _classCallCheck(this, TokenInput);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TokenInput).apply(this, arguments));
    _this.onChange = _this.onChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.bindInput = _this.bindInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(TokenInput, [{
    key: "focus",
    value: function focus() {
      this.input.focus();
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      return this.input === document.activeElement;
    }
  }, {
    key: "bindInput",
    value: function bindInput(ref) {
      this.input = ref;
    }
  }, {
    key: "onChange",
    value: function onChange(event) {
      this.props.onChange({
        value: event.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          value = _this$props.value,
          placeholder = _this$props.placeholder,
          isExpanded = _this$props.isExpanded,
          instanceId = _this$props.instanceId,
          selectedSuggestionIndex = _this$props.selectedSuggestionIndex,
          props = _objectWithoutProperties(_this$props, ["value", "placeholder", "isExpanded", "instanceId", "selectedSuggestionIndex"]);

      var size = (value.length === 0 && placeholder && placeholder.length || value.length) + 1;
      return createElement("input", _extends({
        ref: this.bindInput,
        id: "components-form-token-input-".concat(instanceId),
        type: "text"
      }, props, {
        value: value,
        placeholder: placeholder,
        onChange: this.onChange,
        size: size,
        className: "components-form-token-field__input",
        role: "combobox",
        "aria-expanded": isExpanded,
        "aria-autocomplete": "list",
        "aria-owns": isExpanded ? "components-form-token-suggestions-".concat(instanceId) : undefined,
        "aria-activedescendant": selectedSuggestionIndex !== -1 ? "components-form-token-suggestions-".concat(instanceId, "-").concat(selectedSuggestionIndex) : undefined,
        "aria-describedby": "components-form-token-suggestions-howto-".concat(instanceId)
      }));
    }
  }]);

  return TokenInput;
}(Component);

export default TokenInput;