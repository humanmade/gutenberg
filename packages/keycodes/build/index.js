"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMacOS = isMacOS;
exports.isKeyboardEvent = exports.displayShortcut = exports.rawShortcut = exports.SHIFT = exports.COMMAND = exports.CTRL = exports.ALT = exports.F10 = exports.DELETE = exports.DOWN = exports.RIGHT = exports.UP = exports.LEFT = exports.SPACE = exports.ESCAPE = exports.ENTER = exports.TAB = exports.BACKSPACE = void 0;

require("core-js/modules/es6.regexp.replace");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

/**
 * Note: The order of the modifier keys in many of the [foo]Shortcut()
 * functions in this file are intentional and should not be changed. They're
 * designed to fit with the standard menu keyboard shortcuts shown in the
 * user's platform.
 *
 * For example, on MacOS menu shortcuts will place Shift before Command, but
 * on Windows Control will usually come first. So don't provide your own
 * shortcut combos directly to keyboardShortcut().
 */

/**
 * External dependencies
 */
var BACKSPACE = 8;
exports.BACKSPACE = BACKSPACE;
var TAB = 9;
exports.TAB = TAB;
var ENTER = 13;
exports.ENTER = ENTER;
var ESCAPE = 27;
exports.ESCAPE = ESCAPE;
var SPACE = 32;
exports.SPACE = SPACE;
var LEFT = 37;
exports.LEFT = LEFT;
var UP = 38;
exports.UP = UP;
var RIGHT = 39;
exports.RIGHT = RIGHT;
var DOWN = 40;
exports.DOWN = DOWN;
var DELETE = 46;
exports.DELETE = DELETE;
var F10 = 121;
exports.F10 = F10;
var ALT = 'alt';
exports.ALT = ALT;
var CTRL = 'ctrl'; // Understood in both Mousetrap and TinyMCE.

exports.CTRL = CTRL;
var COMMAND = 'meta';
exports.COMMAND = COMMAND;
var SHIFT = 'shift';
/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window   window object by default; used for DI testing.
 *
 * @return {boolean}         True if MacOS; false otherwise.
 */

exports.SHIFT = SHIFT;

function isMacOS() {
  var _window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  return _window.navigator.platform.indexOf('Mac') !== -1;
}

var modifiers = {
  primary: function primary(_isMac) {
    return _isMac() ? [COMMAND] : [CTRL];
  },
  primaryShift: function primaryShift(_isMac) {
    return _isMac() ? [SHIFT, COMMAND] : [CTRL, SHIFT];
  },
  secondary: function secondary(_isMac) {
    return _isMac() ? [SHIFT, ALT, COMMAND] : [CTRL, SHIFT, ALT];
  },
  access: function access(_isMac) {
    return _isMac() ? [CTRL, ALT] : [SHIFT, ALT];
  }
};
/**
 * An object that contains functions to get raw shortcuts.
 * E.g. rawShortcut.primary( 'm' ) will return 'meta+m' on Mac.
 * These are intended for user with the KeyboardShortcuts component or TinyMCE.
 *
 * @type {Object} Keyed map of functions to raw shortcuts.
 */

var rawShortcut = (0, _lodash.mapValues)(modifiers, function (modifier) {
  return function (character) {
    var _isMac = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isMacOS;

    return (0, _toConsumableArray2.default)(modifier(_isMac)).concat([character.toLowerCase()]).join('+');
  };
});
/**
 * An object that contains functions to display shortcuts.
 * E.g. displayShortcut.primary( 'm' ) will return '⌘M' on Mac.
 *
 * @type {Object} Keyed map of functions to display shortcuts.
 */

exports.rawShortcut = rawShortcut;
var displayShortcut = (0, _lodash.mapValues)(modifiers, function (modifier) {
  return function (character) {
    var _replacementKeyMap;

    var _isMac = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isMacOS;

    var isMac = _isMac();

    var replacementKeyMap = (_replacementKeyMap = {}, (0, _defineProperty2.default)(_replacementKeyMap, ALT, isMac ? 'Option' : 'Alt'), (0, _defineProperty2.default)(_replacementKeyMap, CTRL, 'Ctrl'), (0, _defineProperty2.default)(_replacementKeyMap, COMMAND, '⌘'), (0, _defineProperty2.default)(_replacementKeyMap, SHIFT, 'Shift'), _replacementKeyMap);
    var shortcut = (0, _toConsumableArray2.default)(modifier(_isMac).map(function (key) {
      return (0, _lodash.get)(replacementKeyMap, key, key);
    })).concat([character.toUpperCase()]).join('+'); // Because we use just the clover symbol for MacOS's "command" key, remove
    // the key join character ("+") between it and the final character if that
    // final character is alphanumeric. ⌘S looks nicer than ⌘+S.

    return shortcut.replace(/⌘\+([A-Z0-9])$/g, '⌘$1');
  };
});
/**
 * An object that contains functions to check if a keyboard event matches a
 * predefined shortcut combination.
 * E.g. isKeyboardEvent.primary( event, 'm' ) will return true if the event
 * signals pressing ⌘M.
 *
 * @type {Object} Keyed map of functions to match events.
 */

exports.displayShortcut = displayShortcut;
var isKeyboardEvent = (0, _lodash.mapValues)(modifiers, function (getModifiers) {
  return function (event, character) {
    var _isMac = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isMacOS;

    var mods = getModifiers(_isMac);

    if (!mods.every(function (key) {
      return event["".concat(key, "Key")];
    })) {
      return false;
    }

    if (!character) {
      return (0, _lodash.includes)(mods, event.key.toLowerCase());
    }

    return event.key === character;
  };
});
exports.isKeyboardEvent = isKeyboardEvent;