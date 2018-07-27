"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.array.find");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Autocomplete = void 0;

var _element = require("@wordpress/element");

require("core-js/modules/es6.regexp.constructor");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

require("core-js/modules/es6.regexp.search");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classnames = _interopRequireDefault(require("classnames"));

var _lodash = require("lodash");

require("element-closest");

var _keycodes = require("@wordpress/keycodes");

var _i18n = require("@wordpress/i18n");

var _compose = require("@wordpress/compose");

var _withFocusOutside = _interopRequireDefault(require("../higher-order/with-focus-outside"));

var _button = _interopRequireDefault(require("../button"));

var _popover = _interopRequireDefault(require("../popover"));

var _withSpokenMessages = _interopRequireDefault(require("../higher-order/with-spoken-messages"));

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
 * A raw completer option.
 * @typedef {*} CompleterOption
 */

/**
 * @callback FnGetOptions
 *
 * @returns {(CompleterOption[]|Promise.<CompleterOption[]>)} The completer options or a promise for them.
 */

/**
 * @callback FnGetOptionKeywords
 * @param {CompleterOption} option a completer option.
 *
 * @returns {string[]} list of key words to search.
 */

/**
 * @callback FnIsOptionDisabled
 * @param {CompleterOption} option a completer option.
 *
 * @returns {string[]} whether or not the given option is disabled.
 */

/**
 * @callback FnGetOptionLabel
 * @param {CompleterOption} option a completer option.
 *
 * @returns {(string|Array.<(string|Component)>)} list of react components to render.
 */

/**
 * @callback FnAllowNode
 * @param {Node} textNode check if the completer can handle this text node.
 *
 * @returns {boolean} true if the completer can handle this text node.
 */

/**
 * @callback FnAllowContext
 * @param {Range} before the range before the auto complete trigger and query.
 * @param {Range} after the range after the autocomplete trigger and query.
 *
 * @returns {boolean} true if the completer can handle these ranges.
 */

/**
 * @typedef {Object} OptionCompletion
 * @property {('insert-at-caret', 'replace')} action the intended placement of the completion.
 * @property {OptionCompletionValue} value the completion value.
 */

/**
 * A completion value.
 * @typedef {(String|WPElement|Object)} OptionCompletionValue
 */

/**
 * @callback FnGetOptionCompletion
 * @param {CompleterOption} value the value of the completer option.
 * @param {Range} range the nodes included in the autocomplete trigger and query.
 * @param {String} query the text value of the autocomplete query.
 *
 * @returns {(OptionCompletion|OptionCompletionValue)} the completion for the given option. If an
 * 													   OptionCompletionValue is returned, the
 * 													   completion action defaults to `insert-at-caret`.
 */

/**
 * @typedef {Object} Completer
 * @property {String} name a way to identify a completer, useful for selective overriding.
 * @property {?String} className A class to apply to the popup menu.
 * @property {String} triggerPrefix the prefix that will display the menu.
 * @property {(CompleterOption[]|FnGetOptions)} options the completer options or a function to get them.
 * @property {?FnGetOptionKeywords} getOptionKeywords get the keywords for a given option.
 * @property {?FnIsOptionDisabled} isOptionDisabled get whether or not the given option is disabled.
 * @property {FnGetOptionLabel} getOptionLabel get the label for a given option.
 * @property {?FnAllowNode} allowNode filter the allowed text nodes in the autocomplete.
 * @property {?FnAllowContext} allowContext filter the context under which the autocomplete activates.
 * @property {FnGetOptionCompletion} getOptionCompletion get the completion associated with a given option.
 */

/**
 * Recursively select the firstChild until hitting a leaf node.
 *
 * @param {Node} node The node to find the recursive first child.
 *
 * @return {Node} The first leaf-node >= node in the ordering.
 */
function descendFirst(node) {
  var n = node;

  while (n.firstChild) {
    n = n.firstChild;
  }

  return n;
}
/**
 * Recursively select the lastChild until hitting a leaf node.
 *
 * @param {Node} node The node to find the recursive last child.
 *
 * @return {Node} The first leaf-node <= node in the ordering.
 */


function descendLast(node) {
  var n = node;

  while (n.lastChild) {
    n = n.lastChild;
  }

  return n;
}
/**
 * Is the node a text node.
 *
 * @param {?Node} node The node to check.
 *
 * @return {boolean} True if the node is a text node.
 */


function isTextNode(node) {
  return node !== null && node.nodeType === 3;
}
/**
 * Return the node only if it is a text node, otherwise return null.
 *
 * @param {?Node} node The node to filter.
 *
 * @return {?Node} The node or null if it is not a text node.
 */


function onlyTextNode(node) {
  return isTextNode(node) ? node : null;
}
/**
 * Find the index of the last character in the text that is whitespace.
 *
 * @param {string} text The text to search.
 *
 * @return {number} The last index of a white space character in the text or -1.
 */


function lastIndexOfSpace(text) {
  for (var i = text.length - 1; i >= 0; i--) {
    if (/\s/.test(text.charAt(i))) {
      return i;
    }
  }

  return -1;
}

function filterOptions(search) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var maxResults = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
  var filtered = [];

  for (var i = 0; i < options.length; i++) {
    var option = options[i]; // Merge label into keywords

    var _option$keywords = option.keywords,
        keywords = _option$keywords === void 0 ? [] : _option$keywords;

    if ('string' === typeof option.label) {
      keywords = (0, _toConsumableArray2.default)(keywords).concat([option.label]);
    }

    var isMatch = keywords.some(function (keyword) {
      return search.test(keyword);
    });

    if (!isMatch) {
      continue;
    }

    filtered.push(option); // Abort early if max reached

    if (filtered.length === maxResults) {
      break;
    }
  }

  return filtered;
}

var Autocomplete =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(Autocomplete, _Component);
  (0, _createClass2.default)(Autocomplete, null, [{
    key: "getInitialState",
    value: function getInitialState() {
      return {
        search: /./,
        selectedIndex: 0,
        suppress: undefined,
        open: undefined,
        query: undefined,
        range: undefined,
        filteredOptions: []
      };
    }
  }]);

  function Autocomplete() {
    var _this;

    (0, _classCallCheck2.default)(this, Autocomplete);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Autocomplete).apply(this, arguments));
    _this.bindNode = _this.bindNode.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.select = _this.select.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.reset = _this.reset.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.resetWhenSuppressed = _this.resetWhenSuppressed.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.search = _this.search.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.handleKeyDown = _this.handleKeyDown.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.getWordRect = _this.getWordRect.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.debouncedLoadOptions = (0, _lodash.debounce)(_this.loadOptions, 250);
    _this.state = _this.constructor.getInitialState();
    return _this;
  }

  (0, _createClass2.default)(Autocomplete, [{
    key: "bindNode",
    value: function bindNode(node) {
      this.node = node;
    }
  }, {
    key: "insertCompletion",
    value: function insertCompletion(range, replacement) {
      var container = document.createElement('div');
      container.innerHTML = (0, _element.renderToString)(replacement);

      while (container.firstChild) {
        var child = container.firstChild;
        container.removeChild(child);
        range.insertNode(child);
        range.setStartAfter(child);
      }

      range.deleteContents();
      var inputEvent;

      if (undefined !== window.InputEvent) {
        inputEvent = new window.InputEvent('input', {
          bubbles: true,
          cancelable: false
        });
      } else {
        // IE11 doesn't provide an InputEvent constructor.
        inputEvent = document.createEvent('UIEvent');
        inputEvent.initEvent('input', true
        /* bubbles */
        , false
        /* cancelable */
        );
      }

      range.commonAncestorContainer.closest('[contenteditable=true]').dispatchEvent(inputEvent);
    }
  }, {
    key: "select",
    value: function select(option) {
      var onReplace = this.props.onReplace;
      var _this$state = this.state,
          open = _this$state.open,
          range = _this$state.range,
          query = _this$state.query;

      var _ref = open || {},
          getOptionCompletion = _ref.getOptionCompletion;

      if (option.isDisabled) {
        return;
      }

      if (getOptionCompletion) {
        var completion = getOptionCompletion(option.value, range, query);

        var _ref2 = undefined === completion.action || undefined === completion.value ? {
          action: 'insert-at-caret',
          value: completion
        } : completion,
            action = _ref2.action,
            value = _ref2.value;

        if ('replace' === action) {
          onReplace([value]);
        } else if ('insert-at-caret' === action) {
          this.insertCompletion(range, value);
        }
      } // Reset autocomplete state after insertion rather than before
      // so insertion events don't cause the completion menu to redisplay.


      this.reset();
    }
  }, {
    key: "reset",
    value: function reset() {
      var isMounted = !!this.node; // Autocompletions may replace the block containing this component,
      // so we make sure it is mounted before resetting the state.

      if (isMounted) {
        this.setState(this.constructor.getInitialState());
      }
    }
  }, {
    key: "resetWhenSuppressed",
    value: function resetWhenSuppressed() {
      var _this$state2 = this.state,
          open = _this$state2.open,
          suppress = _this$state2.suppress;

      if (open && suppress === open.idx) {
        this.reset();
      }
    }
  }, {
    key: "handleFocusOutside",
    value: function handleFocusOutside() {
      this.reset();
    } // this method is separate so it can be overridden in tests

  }, {
    key: "getCursor",
    value: function getCursor(container) {
      var selection = window.getSelection();

      if (selection.isCollapsed) {
        if ('production' !== process.env.NODE_ENV) {
          if (!container.contains(selection.anchorNode)) {
            throw new Error('Invalid assumption: expected selection to be within the autocomplete container');
          }
        }

        return {
          node: selection.anchorNode,
          offset: selection.anchorOffset
        };
      }

      return null;
    } // this method is separate so it can be overridden in tests

  }, {
    key: "createRange",
    value: function createRange(startNode, startOffset, endNode, endOffset) {
      var range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return range;
    }
  }, {
    key: "announce",
    value: function announce(filteredOptions) {
      var debouncedSpeak = this.props.debouncedSpeak;

      if (!debouncedSpeak) {
        return;
      }

      if (!!filteredOptions.length) {
        debouncedSpeak((0, _i18n.sprintf)((0, _i18n._n)('%d result found, use up and down arrow keys to navigate.', '%d results found, use up and down arrow keys to navigate.', filteredOptions.length), filteredOptions.length), 'assertive');
      } else {
        debouncedSpeak((0, _i18n.__)('No results.'), 'assertive');
      }
    }
    /**
     * Load options for an autocompleter.
     *
     * @param {Completer} completer The autocompleter.
     * @param {string}    query     The query, if any.
     */

  }, {
    key: "loadOptions",
    value: function loadOptions(completer, query) {
      var _this2 = this;

      var options = completer.options;
      /*
       * We support both synchronous and asynchronous retrieval of completer options
       * but internally treat all as async so we maintain a single, consistent code path.
       *
       * Because networks can be slow, and the internet is wonderfully unpredictable,
       * we don't want two promises updating the state at once. This ensures that only
       * the most recent promise will act on `optionsData`. This doesn't use the state
       * because `setState` is batched, and so there's no guarantee that setting
       * `activePromise` in the state would result in it actually being in `this.state`
       * before the promise resolves and we check to see if this is the active promise or not.
       */

      var promise = this.activePromise = _promise.default.resolve(typeof options === 'function' ? options(query) : options).then(function (optionsData) {
        var _this2$setState;

        if (promise !== _this2.activePromise) {
          // Another promise has become active since this one was asked to resolve, so do nothing,
          // or else we might end triggering a race condition updating the state.
          return;
        }

        var keyedOptions = optionsData.map(function (optionData, optionIndex) {
          return {
            key: "".concat(completer.idx, "-").concat(optionIndex),
            value: optionData,
            label: completer.getOptionLabel(optionData),
            keywords: completer.getOptionKeywords ? completer.getOptionKeywords(optionData) : [],
            isDisabled: completer.isOptionDisabled ? completer.isOptionDisabled(optionData) : false
          };
        });
        var filteredOptions = filterOptions(_this2.state.search, keyedOptions);
        var selectedIndex = filteredOptions.length === _this2.state.filteredOptions.length ? _this2.state.selectedIndex : 0;

        _this2.setState((_this2$setState = {}, (0, _defineProperty2.default)(_this2$setState, 'options_' + completer.idx, keyedOptions), (0, _defineProperty2.default)(_this2$setState, "filteredOptions", filteredOptions), (0, _defineProperty2.default)(_this2$setState, "selectedIndex", selectedIndex), _this2$setState));

        _this2.announce(filteredOptions);
      });
    }
  }, {
    key: "findMatch",
    value: function findMatch(container, cursor, allCompleters, wasOpen) {
      var _this3 = this;

      var allowAnything = function allowAnything() {
        return true;
      };

      var endTextNode;
      var endIndex; // search backwards to find the first preceding space or non-text node.

      if (isTextNode(cursor.node)) {
        // TEXT node
        endTextNode = cursor.node;
        endIndex = cursor.offset;
      } else if (cursor.offset === 0) {
        endTextNode = onlyTextNode(descendFirst(cursor.node));
        endIndex = 0;
      } else {
        endTextNode = onlyTextNode(descendLast(cursor.node.childNodes[cursor.offset - 1]));
        endIndex = endTextNode ? endTextNode.nodeValue.length : 0;
      }

      if (endTextNode === null) {
        return null;
      } // store the index of a completer in the object so we can use it to reference the options


      var completers = (0, _lodash.map)(allCompleters, function (completer, idx) {
        return (0, _objectSpread2.default)({}, completer, {
          idx: idx
        });
      });

      if (wasOpen) {
        // put the open completer at the start so it has priority
        completers = [wasOpen].concat((0, _toConsumableArray2.default)((0, _lodash.filter)(completers, function (completer) {
          return completer.idx !== wasOpen.idx;
        })));
      } // filter the completers to those that could handle this node


      completers = (0, _lodash.filter)(completers, function (_ref3) {
        var _ref3$allowNode = _ref3.allowNode,
            allowNode = _ref3$allowNode === void 0 ? allowAnything : _ref3$allowNode;
        return allowNode(endTextNode, container);
      }); // exit early if nothing can handle it

      if (completers.length === 0) {
        return null;
      }

      var startTextNode = endTextNode;
      var text = endTextNode.nodeValue.substring(0, endIndex);
      var pos = lastIndexOfSpace(text);

      while (pos === -1) {
        var prev = onlyTextNode(startTextNode.previousSibling);

        if (prev === null) {
          break;
        } // filter the completers to those that could handle this node


        completers = (0, _lodash.filter)(completers, function (_ref4) {
          var _ref4$allowNode = _ref4.allowNode,
              allowNode = _ref4$allowNode === void 0 ? allowAnything : _ref4$allowNode;
          return allowNode(endTextNode, container);
        }); // exit early if nothing can handle it

        if (completers.length === 0) {
          return null;
        }

        startTextNode = prev;
        text = prev.nodeValue + text;
        pos = lastIndexOfSpace(prev.nodeValue);
      } // exit early if nothing can handle it


      if (text.length <= pos + 1) {
        return null;
      } // find a completer that matches


      var open = (0, _lodash.find)(completers, function (_ref5) {
        var _ref5$triggerPrefix = _ref5.triggerPrefix,
            triggerPrefix = _ref5$triggerPrefix === void 0 ? '' : _ref5$triggerPrefix,
            _ref5$allowContext = _ref5.allowContext,
            allowContext = _ref5$allowContext === void 0 ? allowAnything : _ref5$allowContext;

        if (text.substr(pos + 1, triggerPrefix.length) !== triggerPrefix) {
          return false;
        }

        var before = _this3.createRange(container, 0, startTextNode, pos + 1);

        var after = _this3.createRange(endTextNode, endIndex, container, container.childNodes.length);

        return allowContext(before, after);
      }); // exit if no completers match

      if (!open) {
        return null;
      }

      var _open$triggerPrefix = open.triggerPrefix,
          triggerPrefix = _open$triggerPrefix === void 0 ? '' : _open$triggerPrefix;
      var range = this.createRange(startTextNode, pos + 1, endTextNode, endIndex);
      var query = text.substr(pos + 1 + triggerPrefix.length);
      return {
        open: open,
        range: range,
        query: query
      };
    }
  }, {
    key: "search",
    value: function search(event) {
      var completers = this.props.completers;
      var _this$state3 = this.state,
          wasOpen = _this$state3.open,
          wasSuppress = _this$state3.suppress,
          wasQuery = _this$state3.query;
      var container = event.target; // ensure that the cursor location is unambiguous

      var cursor = this.getCursor(container);

      if (!cursor) {
        return;
      } // look for the trigger prefix and search query just before the cursor location


      var match = this.findMatch(container, cursor, completers, wasOpen);

      var _ref6 = match || {},
          open = _ref6.open,
          query = _ref6.query,
          range = _ref6.range; // asynchronously load the options for the open completer


      if (open && (!wasOpen || open.idx !== wasOpen.idx || query !== wasQuery)) {
        if (open.isDebounced) {
          this.debouncedLoadOptions(open, query);
        } else {
          this.loadOptions(open, query);
        }
      } // create a regular expression to filter the options


      var search = open ? new RegExp('(?:\\b|\\s|^)' + (0, _lodash.escapeRegExp)(query), 'i') : /./; // filter the options we already have

      var filteredOptions = open ? filterOptions(search, this.state['options_' + open.idx]) : []; // check if we should still suppress the popover

      var suppress = open && wasSuppress === open.idx ? wasSuppress : undefined; // update the state

      if (wasOpen || open) {
        this.setState({
          selectedIndex: 0,
          filteredOptions: filteredOptions,
          suppress: suppress,
          search: search,
          open: open,
          query: query,
          range: range
        });
      } // announce the count of filtered options but only if they have loaded


      if (open && this.state['options_' + open.idx]) {
        this.announce(filteredOptions);
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var _this$state4 = this.state,
          open = _this$state4.open,
          suppress = _this$state4.suppress,
          selectedIndex = _this$state4.selectedIndex,
          filteredOptions = _this$state4.filteredOptions;

      if (!open) {
        return;
      }

      if (suppress === open.idx) {
        switch (event.keyCode) {
          // cancel popup suppression on CTRL+SPACE
          case _keycodes.SPACE:
            var ctrlKey = event.ctrlKey,
                shiftKey = event.shiftKey,
                altKey = event.altKey,
                metaKey = event.metaKey;

            if (ctrlKey && !(shiftKey || altKey || metaKey)) {
              this.setState({
                suppress: undefined
              });
              event.preventDefault();
              event.stopPropagation();
            }

            break;
          // reset on cursor movement

          case _keycodes.UP:
          case _keycodes.DOWN:
          case _keycodes.LEFT:
          case _keycodes.RIGHT:
            this.reset();
        }

        return;
      }

      if (filteredOptions.length === 0) {
        return;
      }

      var nextSelectedIndex;

      switch (event.keyCode) {
        case _keycodes.UP:
          nextSelectedIndex = (selectedIndex === 0 ? filteredOptions.length : selectedIndex) - 1;
          this.setState({
            selectedIndex: nextSelectedIndex
          });
          break;

        case _keycodes.DOWN:
          nextSelectedIndex = (selectedIndex + 1) % filteredOptions.length;
          this.setState({
            selectedIndex: nextSelectedIndex
          });
          break;

        case _keycodes.ESCAPE:
          this.setState({
            suppress: open.idx
          });
          break;

        case _keycodes.ENTER:
          this.select(filteredOptions[selectedIndex]);
          break;

        case _keycodes.LEFT:
        case _keycodes.RIGHT:
          this.reset();
          return;

        default:
          return;
      } // Any handled keycode should prevent original behavior. This relies on
      // the early return in the default case.


      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "getWordRect",
    value: function getWordRect() {
      var range = this.state.range;

      if (!range) {
        return;
      }

      return range.getBoundingClientRect();
    }
  }, {
    key: "toggleKeyEvents",
    value: function toggleKeyEvents(isListening) {
      // This exists because we must capture ENTER key presses before RichText.
      // It seems that react fires the simulated capturing events after the
      // native browser event has already bubbled so we can't stopPropagation
      // and avoid RichText getting the event from TinyMCE, hence we must
      // register a native event handler.
      var handler = isListening ? 'addEventListener' : 'removeEventListener';
      this.node[handler]('keydown', this.handleKeyDown, true);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var open = this.state.open;
      var prevOpen = prevState.open;

      if (!open !== !prevOpen) {
        this.toggleKeyEvents(!!open);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.toggleKeyEvents(false);
      this.debouncedLoadOptions.cancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props = this.props,
          children = _this$props.children,
          instanceId = _this$props.instanceId;
      var _this$state5 = this.state,
          open = _this$state5.open,
          suppress = _this$state5.suppress,
          selectedIndex = _this$state5.selectedIndex,
          filteredOptions = _this$state5.filteredOptions;

      var _ref7 = filteredOptions[selectedIndex] || {},
          _ref7$key = _ref7.key,
          selectedKey = _ref7$key === void 0 ? '' : _ref7$key;

      var _ref8 = open || {},
          className = _ref8.className,
          idx = _ref8.idx;

      var isExpanded = suppress !== idx && filteredOptions.length > 0;
      var listBoxId = isExpanded ? "components-autocomplete-listbox-".concat(instanceId) : null;
      var activeId = isExpanded ? "components-autocomplete-item-".concat(instanceId, "-").concat(selectedKey) : null; // Disable reason: Clicking the editor should reset the autocomplete when the menu is suppressed

      /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */

      return (0, _element.createElement)("div", {
        ref: this.bindNode,
        onInput: this.search,
        onClick: this.resetWhenSuppressed,
        className: "components-autocomplete"
      }, children({
        isExpanded: isExpanded,
        listBoxId: listBoxId,
        activeId: activeId
      }), isExpanded && (0, _element.createElement)(_popover.default, {
        focusOnMount: false,
        onClose: this.reset,
        position: "top right",
        className: "components-autocomplete__popover",
        getAnchorRect: this.getWordRect
      }, (0, _element.createElement)("div", {
        id: listBoxId,
        role: "listbox",
        className: "components-autocomplete__results"
      }, isExpanded && (0, _lodash.map)(filteredOptions, function (option, index) {
        return (0, _element.createElement)(_button.default, {
          key: option.key,
          id: "components-autocomplete-item-".concat(instanceId, "-").concat(option.key),
          role: "option",
          "aria-selected": index === selectedIndex,
          disabled: option.isDisabled,
          className: (0, _classnames.default)('components-autocomplete__result', className, {
            'is-selected': index === selectedIndex
          }),
          onClick: function onClick() {
            return _this4.select(option);
          }
        }, option.label);
      }))));
      /* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/onclick-has-role, jsx-a11y/click-events-have-key-events */
    }
  }]);
  return Autocomplete;
}(_element.Component);

exports.Autocomplete = Autocomplete;

var _default = (0, _compose.compose)([_withSpokenMessages.default, _compose.withInstanceId, _withFocusOutside.default] // this MUST be the innermost HOC as it calls handleFocusOutside
)(Autocomplete);

exports.default = _default;