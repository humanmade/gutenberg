'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

exports.setPersistenceStorage = setPersistenceStorage;
exports.withRehydration = withRehydration;
exports.withRehydratation = withRehydratation;
exports.loadAndPersist = loadAndPersist;

var _deprecated = require('@wordpress/deprecated');

var _deprecated2 = _interopRequireDefault(_deprecated);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Defaults to the local storage.
/**
 * WordPress dependencies
 */
var persistenceStorage = window.localStorage;

/**
 * Sets a different persistence storage.
 *
 * @param {Object} storage Persistence storage.
 */


/**
 * External dependencies
 */
function setPersistenceStorage(storage) {
	persistenceStorage = storage;
}

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
	// EnhancedReducer with auto-rehydration
	var enhancedReducer = function enhancedReducer(state, action) {
		var nextState = reducer(state, action);

		if (action.type === 'REDUX_REHYDRATE' && action.storageKey === storageKey) {
			return (0, _extends4.default)({}, nextState, (0, _defineProperty3.default)({}, reducerKey, action.payload));
		}

		return nextState;
	};

	return enhancedReducer;
}

/**
 * Export withRehydratation (a misspelling of withRehydration) for backwards
 * compatibility.
 *
 * @param {Function} reducer    The reducer to enhance.
 * @param {string}   reducerKey The reducer key to persist.
 * @param {string}   storageKey The storage key to use.
 *
 * @return {Function} Enhanced reducer.
 */
function withRehydratation(reducer, reducerKey, storageKey) {
	(0, _deprecated2.default)('wp.data.withRehydratation', {
		version: '3.2',
		alternative: 'wp.data.withRehydration',
		plugin: 'Gutenberg'
	});
	return withRehydration(reducer, reducerKey, storageKey);
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
	// Load initially persisted value
	var persistedString = persistenceStorage.getItem(storageKey);
	if (persistedString) {
		var persistedState = (0, _extends4.default)({}, (0, _lodash.get)(reducer(undefined, { type: '@@gutenberg/init' }), reducerKey), JSON.parse(persistedString));

		store.dispatch({
			type: 'REDUX_REHYDRATE',
			payload: persistedState,
			storageKey: storageKey
		});
	}

	// Persist updated preferences
	var currentStateValue = (0, _lodash.get)(store.getState(), reducerKey);
	store.subscribe(function () {
		var newStateValue = (0, _lodash.get)(store.getState(), reducerKey);
		if (newStateValue !== currentStateValue) {
			currentStateValue = newStateValue;
			var stateToSave = (0, _lodash.get)(reducer(store.getState(), { type: 'SERIALIZE' }), reducerKey);
			persistenceStorage.setItem(storageKey, (0, _stringify2.default)(stateToSave));
		}
	});
}