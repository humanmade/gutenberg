import _JSON$stringify from "@babel/runtime/core-js/json/stringify";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/**
 * External dependencies
 */
import { get } from 'lodash';
/**
 * WordPress dependencies
 */

import deprecated from '@wordpress/deprecated';
/**
 * Internal dependencies
 */

import { getPersistenceStorage } from './persist';
/**
 * Adds the rehydration behavior to redux reducers.
 *
 * @param {Function} reducer    The reducer to enhance.
 * @param {string}   reducerKey The reducer key to persist.
 * @param {string}   storageKey The storage key to use.
 *
 * @return {Function} Enhanced reducer.
 */

export function withRehydration(reducer, reducerKey, storageKey) {
  deprecated('wp.data.withRehydration', {
    version: '3.6',
    plugin: 'Gutenberg',
    hint: 'See https://github.com/WordPress/gutenberg/pull/8146 for more details'
  }); // EnhancedReducer with auto-rehydration

  var enhancedReducer = function enhancedReducer(state, action) {
    var nextState = reducer(state, action);

    if (action.type === 'REDUX_REHYDRATE' && action.storageKey === storageKey) {
      return _objectSpread({}, nextState, _defineProperty({}, reducerKey, action.payload));
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

export function loadAndPersist(store, reducer, reducerKey, storageKey) {
  deprecated('wp.data.loadAndPersist', {
    version: '3.6',
    plugin: 'Gutenberg',
    hint: 'See https://github.com/WordPress/gutenberg/pull/8146 for more details'
  }); // Load initially persisted value

  var persistedString = getPersistenceStorage().getItem(storageKey);

  if (persistedString) {
    var persistedState = _objectSpread({}, get(reducer(undefined, {
      type: '@@gutenberg/init'
    }), reducerKey), JSON.parse(persistedString));

    store.dispatch({
      type: 'REDUX_REHYDRATE',
      payload: persistedState,
      storageKey: storageKey
    });
  } // Persist updated preferences


  var currentStateValue = get(store.getState(), reducerKey);
  store.subscribe(function () {
    var newStateValue = get(store.getState(), reducerKey);

    if (newStateValue !== currentStateValue) {
      currentStateValue = newStateValue;
      var stateToSave = get(reducer(store.getState(), {
        type: 'SERIALIZE'
      }), reducerKey);
      getPersistenceStorage().setItem(storageKey, _JSON$stringify(stateToSave));
    }
  });
}