import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";

/**
 * External dependencies
 */
import { get } from 'lodash';
/**
 * WordPress dependencies
 */

import { combineReducers } from '@wordpress/data';
/**
 * Internal dependencies
 */

import { PREFERENCES_DEFAULTS } from './defaults';
/**
 * The default active general sidebar: The "Document" tab.
 *
 * @type {string}
 */

export var DEFAULT_ACTIVE_GENERAL_SIDEBAR = 'edit-post/document';
/**
 * Reducer returning the user preferences.
 *
 * @param {Object}  state                           Current state.
 * @param {string}  state.mode                      Current editor mode, either
 *                                                  "visual" or "text".
 * @param {boolean} state.isGeneralSidebarDismissed Whether general sidebar is
 *                                                  dismissed. False by default
 *                                                  or when closing general
 *                                                  sidebar, true when opening
 *                                                  sidebar.
 * @param {boolean} state.isSidebarOpened           Whether the sidebar is
 *                                                  opened or closed.
 * @param {Object}  state.panels                    The state of the different
 *                                                  sidebar panels.
 * @param {Object}  action                          Dispatched action.
 *
 * @return {Object} Updated state.
 */

export var preferences = combineReducers({
  isGeneralSidebarDismissed: function isGeneralSidebarDismissed() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'OPEN_GENERAL_SIDEBAR':
      case 'CLOSE_GENERAL_SIDEBAR':
        return action.type === 'CLOSE_GENERAL_SIDEBAR';
    }

    return state;
  },
  panels: function panels() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PREFERENCES_DEFAULTS.panels;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'TOGGLE_PANEL_ENABLED':
        {
          var panelName = action.panelName;
          return _objectSpread({}, state, _defineProperty({}, panelName, _objectSpread({}, state[panelName], {
            enabled: !get(state, [panelName, 'enabled'], true)
          })));
        }

      case 'TOGGLE_PANEL_OPENED':
        {
          var _panelName = action.panelName;
          var isOpen = state[_panelName] === true || get(state, [_panelName, 'opened'], false);
          return _objectSpread({}, state, _defineProperty({}, _panelName, _objectSpread({}, state[_panelName], {
            opened: !isOpen
          })));
        }
    }

    return state;
  },
  features: function features() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PREFERENCES_DEFAULTS.features;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (action.type === 'TOGGLE_FEATURE') {
      return _objectSpread({}, state, _defineProperty({}, action.feature, !state[action.feature]));
    }

    return state;
  },
  editorMode: function editorMode() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PREFERENCES_DEFAULTS.editorMode;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (action.type === 'SWITCH_MODE') {
      return action.mode;
    }

    return state;
  },
  pinnedPluginItems: function pinnedPluginItems() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : PREFERENCES_DEFAULTS.pinnedPluginItems;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (action.type === 'TOGGLE_PINNED_PLUGIN_ITEM') {
      return _objectSpread({}, state, _defineProperty({}, action.pluginName, !get(state, [action.pluginName], true)));
    }

    return state;
  }
});
/**
 * Reducer returning the next active general sidebar state. The active general
 * sidebar is a unique name to identify either an editor or plugin sidebar.
 *
 * @param {?string} state  Current state.
 * @param {Object}  action Action object.
 *
 * @return {?string} Updated state.
 */

export function activeGeneralSidebar() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ACTIVE_GENERAL_SIDEBAR;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'OPEN_GENERAL_SIDEBAR':
      return action.name;
  }

  return state;
}
export function panel() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'document';
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_ACTIVE_PANEL':
      return action.panel;
  }

  return state;
}
/**
 * Reducer for storing the name of the open modal, or null if no modal is open.
 *
 * @param {Object} state  Previous state.
 * @param {Object} action Action object containing the `name` of the modal
 *
 * @return {Object} Updated state
 */

export function activeModal() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'OPEN_MODAL':
      return action.name;

    case 'CLOSE_MODAL':
      return null;
  }

  return state;
}
export function publishSidebarActive() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'OPEN_PUBLISH_SIDEBAR':
      return true;

    case 'CLOSE_PUBLISH_SIDEBAR':
      return false;

    case 'TOGGLE_PUBLISH_SIDEBAR':
      return !state;
  }

  return state;
}
/**
 * Reducer keeping track of the meta boxes isSaving state.
 * A "true" value means the meta boxes saving request is in-flight.
 *
 *
 * @param {boolean}  state   Previous state.
 * @param {Object}   action  Action Object.
 *
 * @return {Object} Updated state.
 */

export function isSavingMetaBoxes() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'REQUEST_META_BOX_UPDATES':
      return true;

    case 'META_BOX_UPDATES_SUCCESS':
      return false;

    default:
      return state;
  }
}
/**
 * Reducer keeping track of the meta boxes per location.
 *
 * @param {boolean}  state   Previous state.
 * @param {Object}   action  Action Object.
 *
 * @return {Object} Updated state.
 */

export function metaBoxLocations() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'SET_META_BOXES_PER_LOCATIONS':
      return action.metaBoxesPerLocation;
  }

  return state;
}
var metaBoxes = combineReducers({
  isSaving: isSavingMetaBoxes,
  locations: metaBoxLocations
});
export default combineReducers({
  preferences: preferences,
  activeGeneralSidebar: activeGeneralSidebar,
  panel: panel,
  activeModal: activeModal,
  publishSidebarActive: publishSidebarActive,
  metaBoxes: metaBoxes
});
//# sourceMappingURL=reducer.js.map