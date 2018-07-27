"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setPersistenceStorage = setPersistenceStorage;
exports.getPersistenceStorage = getPersistenceStorage;
exports.withRehydration = withRehydration;
exports.restrictPersistence = restrictPersistence;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

// Defaults to the local storage.
var persistenceStorage;
/**
 * Sets a different persistence storage.
 *
 * @param {Object} storage Persistence storage.
 */

function setPersistenceStorage(storage) {
  persistenceStorage = storage;
}
/**
 * Get the persistence storage handler.
 *
 * @return {Object} Persistence storage.
 */


function getPersistenceStorage() {
  return persistenceStorage || window.localStorage;
}
/**
 * Adds the rehydration behavior to redux reducers.
 *
 * @param {Function} reducer    The reducer to enhance.
 * @param {string}   storageKey The storage key to use.
 *
 * @return {Function} Enhanced reducer.
 */


function withRehydration(reducer) {
  // EnhancedReducer with auto-rehydration
  var enhancedReducer = function enhancedReducer(state, action) {
    if (action.type === 'REDUX_REHYDRATE') {
      return reducer(action.payload, (0, _objectSpread3.default)({}, action, {
        previousState: state
      }));
    }

    return reducer(state, action);
  };

  return enhancedReducer;
}
/**
 * Higher-order reducer used to persist just one key from the reducer state.
 *
 * @param {function} reducer    Reducer function.
 * @param {string} keyToPersist The reducer key to persist.
 *
 * @return {function} Updated reducer.
 */


function restrictPersistence(reducer, keyToPersist) {
  return function (state, action) {
    var nextState = reducer(state, action);

    if (action.type === 'SERIALIZE') {
      // Returning the same instance if the state is kept identical avoids reserializing again
      if (action.previousState && action.previousState[keyToPersist] === nextState[keyToPersist]) {
        return action.previousState;
      }

      return (0, _defineProperty2.default)({}, keyToPersist, nextState[keyToPersist]);
    }

    if (action.type === 'REDUX_REHYDRATE') {
      return (0, _objectSpread3.default)({}, action.previousState, state, (0, _defineProperty2.default)({}, keyToPersist, (0, _objectSpread3.default)({}, action.previousState[keyToPersist], state[keyToPersist])));
    }

    return nextState;
  };
}