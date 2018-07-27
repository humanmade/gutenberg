import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
// Defaults to the local storage.
var persistenceStorage;
/**
 * Sets a different persistence storage.
 *
 * @param {Object} storage Persistence storage.
 */

export function setPersistenceStorage(storage) {
  persistenceStorage = storage;
}
/**
 * Get the persistence storage handler.
 *
 * @return {Object} Persistence storage.
 */

export function getPersistenceStorage() {
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

export function withRehydration(reducer) {
  // EnhancedReducer with auto-rehydration
  var enhancedReducer = function enhancedReducer(state, action) {
    if (action.type === 'REDUX_REHYDRATE') {
      return reducer(action.payload, _objectSpread({}, action, {
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

export function restrictPersistence(reducer, keyToPersist) {
  return function (state, action) {
    var nextState = reducer(state, action);

    if (action.type === 'SERIALIZE') {
      // Returning the same instance if the state is kept identical avoids reserializing again
      if (action.previousState && action.previousState[keyToPersist] === nextState[keyToPersist]) {
        return action.previousState;
      }

      return _defineProperty({}, keyToPersist, nextState[keyToPersist]);
    }

    if (action.type === 'REDUX_REHYDRATE') {
      return _objectSpread({}, action.previousState, state, _defineProperty({}, keyToPersist, _objectSpread({}, action.previousState[keyToPersist], state[keyToPersist])));
    }

    return nextState;
  };
}