import _Object$freeze from "@babel/runtime/core-js/object/freeze";
import _Object$assign from "@babel/runtime/core-js/object/assign";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _typeof from "@babel/runtime/helpers/typeof";
import "core-js/modules/es6.regexp.split";
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
import { last, take, clone, uniq, map, difference, each, identity, some } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { __, _n, sprintf } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';
/**
 * Internal dependencies
 */

import Token from './token';
import TokenInput from './token-input';
import SuggestionsList from './suggestions-list';
import withSpokenMessages from '../higher-order/with-spoken-messages';
var initialState = {
  incompleteTokenValue: '',
  inputOffsetFromEnd: 0,
  isActive: false,
  isExpanded: false,
  selectedSuggestionIndex: -1,
  selectedSuggestionScroll: false
};

var FormTokenField =
/*#__PURE__*/
function (_Component) {
  _inherits(FormTokenField, _Component);

  function FormTokenField() {
    var _this;

    _classCallCheck(this, FormTokenField);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormTokenField).apply(this, arguments));
    _this.state = initialState;
    _this.onKeyDown = _this.onKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onKeyPress = _this.onKeyPress.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onFocus = _this.onFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onBlur = _this.onBlur.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.deleteTokenBeforeInput = _this.deleteTokenBeforeInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.deleteTokenAfterInput = _this.deleteTokenAfterInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.addCurrentToken = _this.addCurrentToken.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onContainerTouched = _this.onContainerTouched.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderToken = _this.renderToken.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTokenClickRemove = _this.onTokenClickRemove.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onSuggestionHovered = _this.onSuggestionHovered.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onSuggestionSelected = _this.onSuggestionSelected.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onInputChange = _this.onInputChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.bindInput = _this.bindInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.bindTokensAndInput = _this.bindTokensAndInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(FormTokenField, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      // Make sure to focus the input when the isActive state is true.
      if (this.state.isActive && !this.input.hasFocus()) {
        this.input.focus();
      }
    }
  }, {
    key: "bindInput",
    value: function bindInput(ref) {
      this.input = ref;
    }
  }, {
    key: "bindTokensAndInput",
    value: function bindTokensAndInput(ref) {
      this.tokensAndInput = ref;
    }
  }, {
    key: "onFocus",
    value: function onFocus(event) {
      // If focus is on the input or on the container, set the isActive state to true.
      if (this.input.hasFocus() || event.target === this.tokensAndInput) {
        this.setState({
          isActive: true
        });
      } else {
        /*
         * Otherwise, focus is on one of the token "remove" buttons and we
         * set the isActive state to false to prevent the input to be
         * re-focused, see componentDidUpdate().
         */
        this.setState({
          isActive: false
        });
      }

      if ('function' === typeof this.props.onFocus) {
        this.props.onFocus(event);
      }
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      if (this.inputHasValidValue()) {
        this.setState({
          isActive: false
        });
      } else {
        this.setState(initialState);
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      var preventDefault = false;

      switch (event.keyCode) {
        case 8:
          // backspace (delete to left)
          preventDefault = this.handleDeleteKey(this.deleteTokenBeforeInput);
          break;

        case 13:
          // enter/return
          preventDefault = this.addCurrentToken();
          break;

        case 37:
          // left arrow
          preventDefault = this.handleLeftArrowKey();
          break;

        case 38:
          // up arrow
          preventDefault = this.handleUpArrowKey();
          break;

        case 39:
          // right arrow
          preventDefault = this.handleRightArrowKey();
          break;

        case 40:
          // down arrow
          preventDefault = this.handleDownArrowKey();
          break;

        case 46:
          // delete (to right)
          preventDefault = this.handleDeleteKey(this.deleteTokenAfterInput);
          break;

        case 32:
          // space
          if (this.props.tokenizeOnSpace) {
            preventDefault = this.addCurrentToken();
          }

          break;

        default:
          break;
      }

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }, {
    key: "onKeyPress",
    value: function onKeyPress(event) {
      var preventDefault = false;

      switch (event.charCode) {
        case 44:
          // comma
          preventDefault = this.handleCommaKey();
          break;

        default:
          break;
      }

      if (preventDefault) {
        event.preventDefault();
      }
    }
  }, {
    key: "onContainerTouched",
    value: function onContainerTouched(event) {
      // Prevent clicking/touching the tokensAndInput container from blurring
      // the input and adding the current token.
      if (event.target === this.tokensAndInput && this.state.isActive) {
        event.preventDefault();
      }
    }
  }, {
    key: "onTokenClickRemove",
    value: function onTokenClickRemove(event) {
      this.deleteToken(event.value);
      this.input.focus();
    }
  }, {
    key: "onSuggestionHovered",
    value: function onSuggestionHovered(suggestion) {
      var index = this.getMatchingSuggestions().indexOf(suggestion);

      if (index >= 0) {
        this.setState({
          selectedSuggestionIndex: index,
          selectedSuggestionScroll: false
        });
      }
    }
  }, {
    key: "onSuggestionSelected",
    value: function onSuggestionSelected(suggestion) {
      this.addNewToken(suggestion);
    }
  }, {
    key: "onInputChange",
    value: function onInputChange(event) {
      var text = event.value;
      var separator = this.props.tokenizeOnSpace ? /[ ,\t]+/ : /[,\t]+/;
      var items = text.split(separator);
      var tokenValue = last(items) || '';

      if (items.length > 1) {
        this.addNewTokens(items.slice(0, -1));
      }

      this.setState({
        incompleteTokenValue: tokenValue,
        selectedSuggestionIndex: -1,
        selectedSuggestionScroll: false,
        isExpanded: false
      });
      this.props.onInputChange(tokenValue);
      var inputHasMinimumChars = tokenValue.trim().length > 1;

      if (inputHasMinimumChars) {
        var matchingSuggestions = this.getMatchingSuggestions(tokenValue);
        this.setState({
          isExpanded: !!matchingSuggestions.length
        });

        if (!!matchingSuggestions.length) {
          this.props.debouncedSpeak(sprintf(_n('%d result found, use up and down arrow keys to navigate.', '%d results found, use up and down arrow keys to navigate.', matchingSuggestions.length), matchingSuggestions.length), 'assertive');
        } else {
          this.props.debouncedSpeak(__('No results.'), 'assertive');
        }
      }
    }
  }, {
    key: "handleDeleteKey",
    value: function handleDeleteKey(deleteToken) {
      var preventDefault = false;

      if (this.input.hasFocus() && this.isInputEmpty()) {
        deleteToken();
        preventDefault = true;
      }

      return preventDefault;
    }
  }, {
    key: "handleLeftArrowKey",
    value: function handleLeftArrowKey() {
      var preventDefault = false;

      if (this.isInputEmpty()) {
        this.moveInputBeforePreviousToken();
        preventDefault = true;
      }

      return preventDefault;
    }
  }, {
    key: "handleRightArrowKey",
    value: function handleRightArrowKey() {
      var preventDefault = false;

      if (this.isInputEmpty()) {
        this.moveInputAfterNextToken();
        preventDefault = true;
      }

      return preventDefault;
    }
  }, {
    key: "handleUpArrowKey",
    value: function handleUpArrowKey() {
      this.setState(function (state) {
        return {
          selectedSuggestionIndex: Math.max((state.selectedSuggestionIndex || 0) - 1, 0),
          selectedSuggestionScroll: true
        };
      });
      return true; // preventDefault
    }
  }, {
    key: "handleDownArrowKey",
    value: function handleDownArrowKey() {
      var _this2 = this;

      this.setState(function (state, props) {
        return {
          selectedSuggestionIndex: Math.min(state.selectedSuggestionIndex + 1 || 0, _this2.getMatchingSuggestions(state.incompleteTokenValue, props.suggestions, props.value, props.maxSuggestions, props.saveTransform).length - 1),
          selectedSuggestionScroll: true
        };
      });
      return true; // preventDefault
    }
  }, {
    key: "handleCommaKey",
    value: function handleCommaKey() {
      if (this.inputHasValidValue()) {
        this.addNewToken(this.state.incompleteTokenValue);
      }

      return true; // preventDefault
    }
  }, {
    key: "moveInputToIndex",
    value: function moveInputToIndex(index) {
      this.setState(function (state, props) {
        return {
          inputOffsetFromEnd: props.value.length - Math.max(index, -1) - 1
        };
      });
    }
  }, {
    key: "moveInputBeforePreviousToken",
    value: function moveInputBeforePreviousToken() {
      this.setState(function (state, props) {
        return {
          inputOffsetFromEnd: Math.min(state.inputOffsetFromEnd + 1, props.value.length)
        };
      });
    }
  }, {
    key: "moveInputAfterNextToken",
    value: function moveInputAfterNextToken() {
      this.setState(function (state) {
        return {
          inputOffsetFromEnd: Math.max(state.inputOffsetFromEnd - 1, 0)
        };
      });
    }
  }, {
    key: "deleteTokenBeforeInput",
    value: function deleteTokenBeforeInput() {
      var index = this.getIndexOfInput() - 1;

      if (index > -1) {
        this.deleteToken(this.props.value[index]);
      }
    }
  }, {
    key: "deleteTokenAfterInput",
    value: function deleteTokenAfterInput() {
      var index = this.getIndexOfInput();

      if (index < this.props.value.length) {
        this.deleteToken(this.props.value[index]); // update input offset since it's the offset from the last token

        this.moveInputToIndex(index);
      }
    }
  }, {
    key: "addCurrentToken",
    value: function addCurrentToken() {
      var preventDefault = false;
      var selectedSuggestion = this.getSelectedSuggestion();

      if (selectedSuggestion) {
        this.addNewToken(selectedSuggestion);
        preventDefault = true;
      } else if (this.inputHasValidValue()) {
        this.addNewToken(this.state.incompleteTokenValue);
        preventDefault = true;
      }

      return preventDefault;
    }
  }, {
    key: "addNewTokens",
    value: function addNewTokens(tokens) {
      var _this3 = this;

      var tokensToAdd = uniq(tokens.map(this.props.saveTransform).filter(Boolean).filter(function (token) {
        return !_this3.valueContainsToken(token);
      }));

      if (tokensToAdd.length > 0) {
        var newValue = clone(this.props.value);
        newValue.splice.apply(newValue, [this.getIndexOfInput(), 0].concat(tokensToAdd));
        this.props.onChange(newValue);
      }
    }
  }, {
    key: "addNewToken",
    value: function addNewToken(token) {
      this.addNewTokens([token]);
      this.props.speak(this.props.messages.added, 'assertive');
      this.setState({
        incompleteTokenValue: '',
        selectedSuggestionIndex: -1,
        selectedSuggestionScroll: false
      });

      if (this.state.isActive) {
        this.input.focus();
      }
    }
  }, {
    key: "deleteToken",
    value: function deleteToken(token) {
      var _this4 = this;

      var newTokens = this.props.value.filter(function (item) {
        return _this4.getTokenValue(item) !== _this4.getTokenValue(token);
      });
      this.props.onChange(newTokens);
      this.props.speak(this.props.messages.removed, 'assertive');
    }
  }, {
    key: "getTokenValue",
    value: function getTokenValue(token) {
      if ('object' === _typeof(token)) {
        return token.value;
      }

      return token;
    }
  }, {
    key: "getMatchingSuggestions",
    value: function getMatchingSuggestions() {
      var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.incompleteTokenValue;
      var suggestions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.suggestions;
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.value;
      var maxSuggestions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.props.maxSuggestions;
      var saveTransform = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.props.saveTransform;
      var match = saveTransform(searchValue);
      var startsWithMatch = [];
      var containsMatch = [];

      if (match.length === 0) {
        suggestions = difference(suggestions, value);
      } else {
        match = match.toLocaleLowerCase();
        each(suggestions, function (suggestion) {
          var index = suggestion.toLocaleLowerCase().indexOf(match);

          if (value.indexOf(suggestion) === -1) {
            if (index === 0) {
              startsWithMatch.push(suggestion);
            } else if (index > 0) {
              containsMatch.push(suggestion);
            }
          }
        });
        suggestions = startsWithMatch.concat(containsMatch);
      }

      return take(suggestions, maxSuggestions);
    }
  }, {
    key: "getSelectedSuggestion",
    value: function getSelectedSuggestion() {
      if (this.state.selectedSuggestionIndex !== -1) {
        return this.getMatchingSuggestions()[this.state.selectedSuggestionIndex];
      }
    }
  }, {
    key: "valueContainsToken",
    value: function valueContainsToken(token) {
      var _this5 = this;

      return some(this.props.value, function (item) {
        return _this5.getTokenValue(token) === _this5.getTokenValue(item);
      });
    }
  }, {
    key: "getIndexOfInput",
    value: function getIndexOfInput() {
      return this.props.value.length - this.state.inputOffsetFromEnd;
    }
  }, {
    key: "isInputEmpty",
    value: function isInputEmpty() {
      return this.state.incompleteTokenValue.length === 0;
    }
  }, {
    key: "inputHasValidValue",
    value: function inputHasValidValue() {
      return this.props.saveTransform(this.state.incompleteTokenValue).length > 0;
    }
  }, {
    key: "renderTokensAndInput",
    value: function renderTokensAndInput() {
      var components = map(this.props.value, this.renderToken);
      components.splice(this.getIndexOfInput(), 0, this.renderInput());
      return components;
    }
  }, {
    key: "renderToken",
    value: function renderToken(token, index, tokens) {
      var value = this.getTokenValue(token);
      var status = token.status ? token.status : undefined;
      var termPosition = index + 1;
      var termsCount = tokens.length;
      return createElement(Token, {
        key: 'token-' + value,
        value: value,
        status: status,
        title: token.title,
        displayTransform: this.props.displayTransform,
        onClickRemove: this.onTokenClickRemove,
        isBorderless: token.isBorderless || this.props.isBorderless,
        onMouseEnter: token.onMouseEnter,
        onMouseLeave: token.onMouseLeave,
        disabled: 'error' !== status && this.props.disabled,
        messages: this.props.messages,
        termsCount: termsCount,
        termPosition: termPosition
      });
    }
  }, {
    key: "renderInput",
    value: function renderInput() {
      var _this$props = this.props,
          autoCapitalize = _this$props.autoCapitalize,
          autoComplete = _this$props.autoComplete,
          maxLength = _this$props.maxLength,
          value = _this$props.value,
          placeholder = _this$props.placeholder,
          instanceId = _this$props.instanceId;
      var props = {
        instanceId: instanceId,
        autoCapitalize: autoCapitalize,
        autoComplete: autoComplete,
        ref: this.bindInput,
        key: 'input',
        disabled: this.props.disabled,
        value: this.state.incompleteTokenValue,
        onBlur: this.onBlur,
        isExpanded: this.state.isExpanded,
        selectedSuggestionIndex: this.state.selectedSuggestionIndex
      };

      if (value.length === 0 && placeholder) {
        props.placeholder = placeholder;
      }

      if (!(maxLength && value.length >= maxLength)) {
        props = _objectSpread({}, props, {
          onChange: this.onInputChange
        });
      }

      return createElement(TokenInput, props);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          disabled = _this$props2.disabled,
          _this$props2$placehol = _this$props2.placeholder,
          placeholder = _this$props2$placehol === void 0 ? __('Add item.') : _this$props2$placehol,
          instanceId = _this$props2.instanceId,
          className = _this$props2.className;
      var classes = classnames(className, 'components-form-token-field', {
        'is-active': this.state.isActive,
        'is-disabled': disabled
      });
      var tokenFieldProps = {
        className: classes,
        tabIndex: '-1'
      };
      var matchingSuggestions = this.getMatchingSuggestions();
      var inputHasMinimumChars = this.state.incompleteTokenValue.trim().length > 1;
      var showSuggestions = inputHasMinimumChars && !!matchingSuggestions.length;

      if (!disabled) {
        tokenFieldProps = _Object$assign({}, tokenFieldProps, {
          onKeyDown: this.onKeyDown,
          onKeyPress: this.onKeyPress,
          onFocus: this.onFocus
        });
      } // Disable reason: There is no appropriate role which describes the
      // input container intended accessible usability.
      // TODO: Refactor click detection to use blur to stop propagation.

      /* eslint-disable jsx-a11y/no-static-element-interactions */


      return createElement("div", tokenFieldProps, createElement("label", {
        htmlFor: "components-form-token-input-".concat(instanceId),
        className: "screen-reader-text"
      }, placeholder), createElement("div", {
        ref: this.bindTokensAndInput,
        className: "components-form-token-field__input-container",
        tabIndex: "-1",
        onMouseDown: this.onContainerTouched,
        onTouchStart: this.onContainerTouched
      }, this.renderTokensAndInput()), showSuggestions && createElement(SuggestionsList, {
        instanceId: instanceId,
        match: this.props.saveTransform(this.state.incompleteTokenValue),
        displayTransform: this.props.displayTransform,
        suggestions: matchingSuggestions,
        selectedIndex: this.state.selectedSuggestionIndex,
        scrollIntoView: this.state.selectedSuggestionScroll,
        onHover: this.onSuggestionHovered,
        onSelect: this.onSuggestionSelected
      }), createElement("div", {
        id: "components-form-token-suggestions-howto-".concat(instanceId),
        className: "screen-reader-text"
      }, __('Separate with commas')));
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (!props.disabled || !state.isActive) {
        return null;
      }

      return {
        isActive: false,
        incompleteTokenValue: ''
      };
    }
  }]);

  return FormTokenField;
}(Component);

FormTokenField.defaultProps = {
  suggestions: _Object$freeze([]),
  maxSuggestions: 100,
  value: _Object$freeze([]),
  placeholder: '',
  displayTransform: identity,
  saveTransform: function saveTransform(token) {
    return token.trim();
  },
  onChange: function onChange() {},
  onInputChange: function onInputChange() {},
  isBorderless: false,
  disabled: false,
  tokenizeOnSpace: false,
  messages: {
    added: __('Item added.'),
    removed: __('Item removed.'),
    remove: __('Remove item')
  }
};
export default withSpokenMessages(withInstanceId(FormTokenField));