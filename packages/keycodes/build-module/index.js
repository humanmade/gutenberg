import "core-js/modules/es6.regexp.replace";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

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
import { get, mapValues, includes } from 'lodash';
export var BACKSPACE = 8;
export var TAB = 9;
export var ENTER = 13;
export var ESCAPE = 27;
export var SPACE = 32;
export var LEFT = 37;
export var UP = 38;
export var RIGHT = 39;
export var DOWN = 40;
export var DELETE = 46;
export var F10 = 121;
export var ALT = 'alt';
export var CTRL = 'ctrl'; // Understood in both Mousetrap and TinyMCE.

export var COMMAND = 'meta';
export var SHIFT = 'shift';
/**
 * Return true if platform is MacOS.
 *
 * @param {Object} _window   window object by default; used for DI testing.
 *
 * @return {boolean}         True if MacOS; false otherwise.
 */

export function isMacOS() {
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

export var rawShortcut = mapValues(modifiers, function (modifier) {
  return function (character) {
    var _isMac = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isMacOS;

    return _toConsumableArray(modifier(_isMac)).concat([character.toLowerCase()]).join('+');
  };
});
/**
 * An object that contains functions to display shortcuts.
 * E.g. displayShortcut.primary( 'm' ) will return '⌘M' on Mac.
 *
 * @type {Object} Keyed map of functions to display shortcuts.
 */

export var displayShortcut = mapValues(modifiers, function (modifier) {
  return function (character) {
    var _replacementKeyMap;

    var _isMac = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : isMacOS;

    var isMac = _isMac();

    var replacementKeyMap = (_replacementKeyMap = {}, _defineProperty(_replacementKeyMap, ALT, isMac ? 'Option' : 'Alt'), _defineProperty(_replacementKeyMap, CTRL, 'Ctrl'), _defineProperty(_replacementKeyMap, COMMAND, '⌘'), _defineProperty(_replacementKeyMap, SHIFT, 'Shift'), _replacementKeyMap);

    var shortcut = _toConsumableArray(modifier(_isMac).map(function (key) {
      return get(replacementKeyMap, key, key);
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

export var isKeyboardEvent = mapValues(modifiers, function (getModifiers) {
  return function (event, character) {
    var _isMac = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isMacOS;

    var mods = getModifiers(_isMac);

    if (!mods.every(function (key) {
      return event["".concat(key, "Key")];
    })) {
      return false;
    }

    if (!character) {
      return includes(mods, event.key.toLowerCase());
    }

    return event.key === character;
  };
});