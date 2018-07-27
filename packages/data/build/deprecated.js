"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withRehydration = withRehydration;
exports.loadAndPersist = loadAndPersist;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _lodash = require("lodash");

var _deprecated = _interopRequireDefault(require("@wordpress/deprecated"));

var _persist = require("./persist");

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
 * Adds the rehydration behavior to redux reducers.
 *
 * @param {Function} reducer    The reducer to enhance.
 * @param {string}   reducerKey The reducer key to persist.
 * @param {string}   storageKey The storage key to use.
 *
 * @return {Function} Enhanced reducer.
 */
function withRehydration(reducer, reducerKey, storageKey) {
  (0, _deprecated.default)('wp.data.withRehydration', {
    version: '3.6',
    plugin: 'Gutenberg',
    hint: 'See https://github.com/WordPress/gutenberg/pull/8146 for more details'
  }); // EnhancedReducer with auto-rehydration

  var enhancedReducer = function enhancedReducer(state, action) {
    var nextState = reducer(state, action);

    if (action.type === 'REDUX_REHYDRATE' && action.storageKey === storageKey) {
      return (0, _objectSpread3.default)({}, nextState, (0, _defineProperty2.default)({}, reducerKey, action.payload));
    }

    return nextState;
  };

  return enhancedReducer;
}
/**
 * Loads the initial state and persist on changes.
 *
 * This should be executed after the reducer's registration.
 *
 * @param {Object}   store      Store to enhance.
 * @param {Function} reducer    The reducer function. Used to get default values and to allow custom serialization by the reducers.
 * @param {string}   reducerKey The reducer key to persist (example: reducerKey.subReducerKey).
 * @param {string}   storageKey The storage key to use.
 */


function loadAndPersist(store, reducer, reducerKey, storageKey) {
  (0, _deprecated.default)('wp.data.loadAndPersist', {
    version: '3.6',
    plugin: 'Gutenberg',
    hint: 'See https://github.com/WordPress/gutenberg/pull/8146 for more details'
  }); // Load initially persisted value

  var persistedString = (0, _persist.getPersistenceStorage)().getItem(storageKey);

  if (persistedString) {
    var persistedState = (0, _objectSpread3.default)({}, (0, _lodash.get)(reducer(undefined, {
      type: '@@gutenberg/init'
    }), reducerKey), JSON.parse(persistedString));
    store.dispatch({
      type: 'REDUX_REHYDRATE',
      payload: persistedState,
      storageKey: storageKey
    });
  } // Persist updated preferences


  var currentStateValue = (0, _lodash.get)(store.getState(), reducerKey);
  store.subscribe(function () {
    var newStateValue = (0, _lodash.get)(store.getState(), reducerKey);

    if (newStateValue !== currentStateValue) {
      currentStateValue = newStateValue;
      var stateToSave = (0, _lodash.get)(reducer(store.getState(), {
        type: 'SERIALIZE'
      }), reducerKey);
      (0, _persist.getPersistenceStorage)().setItem(storageKey, (0, _stringify.default)(stateToSave));
    }
  });
}