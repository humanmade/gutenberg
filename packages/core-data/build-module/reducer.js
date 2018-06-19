import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$entries from 'babel-runtime/core-js/object/entries';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _extends from 'babel-runtime/helpers/extends';
/**
 * External dependencies
 */
import { keyBy, map, groupBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { defaultEntities } from './entities';

/**
 * Reducer managing terms state. Keyed by taxonomy slug, the value is either
 * undefined (if no request has been made for given taxonomy), null (if a
 * request is in-flight for given taxonomy), or the array of terms for the
 * taxonomy.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function terms() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case 'RECEIVE_TERMS':
			return _extends({}, state, _defineProperty({}, action.taxonomy, action.terms));
	}

	return state;
}

/**
 * Reducer managing authors state. Keyed by id.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function users() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { byId: {}, queries: {} };
	var action = arguments[1];

	switch (action.type) {
		case 'RECEIVE_USER_QUERY':
			return {
				byId: _extends({}, state.byId, keyBy(action.users, 'id')),
				queries: _extends({}, state.queries, _defineProperty({}, action.queryID, map(action.users, function (user) {
					return user.id;
				})))
			};
	}

	return state;
}

/**
 * Reducer managing taxonomies.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function taxonomies() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	var action = arguments[1];

	switch (action.type) {
		case 'RECEIVE_TAXONOMIES':
			return action.taxonomies;
	}

	return state;
}

/**
 * Reducer managing theme supports data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function themeSupports() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	switch (action.type) {
		case 'RECEIVE_THEME_SUPPORTS':
			return _extends({}, state, action.themeSupports);
	}

	return state;
}

/**
 * Higher Order Reducer for a given entity config. It supports:
 *
 *  - Fetching a record by primary key
 *
 * @param {Object} entityConfig  Entity config.
 *
 * @return {Function} Reducer.
 */
function entity(entityConfig) {
	var key = entityConfig.key || 'id';

	return function () {
		var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { byKey: {} };
		var action = arguments[1];

		if (!action.name || !action.kind || action.name !== entityConfig.name || action.kind !== entityConfig.kind) {
			return state;
		}

		switch (action.type) {
			case 'RECEIVE_ENTITY_RECORDS':
				return {
					byKey: _extends({}, state.byKey, keyBy(action.records, key))
				};
			default:
				return state;
		}
	};
}

/**
 * Reducer keeping track of the registered entities.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function entitiesConfig() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultEntities;
	var action = arguments[1];

	switch (action.type) {
		case 'ADD_ENTITIES':
			return [].concat(_toConsumableArray(state), _toConsumableArray(action.entities));
	}

	return state;
}

/**
 * Reducer keeping track of the registered entities config and data.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export var entities = function entities() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var action = arguments[1];

	var newConfig = entitiesConfig(state.config, action);

	// Generates a dynamic reducer for the entities
	var entitiesDataReducer = state.reducer;
	if (!entitiesDataReducer || newConfig !== state.config) {
		var entitiesByKind = groupBy(newConfig, 'kind');
		entitiesDataReducer = combineReducers(_Object$entries(entitiesByKind).reduce(function (memo, _ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    kind = _ref2[0],
			    subEntities = _ref2[1];

			var kindReducer = combineReducers(subEntities.reduce(function (kindMemo, entityConfig) {
				return _extends({}, kindMemo, _defineProperty({}, entityConfig.name, entity(entityConfig)));
			}, {}));

			memo[kind] = kindReducer;
			return memo;
		}, {}));
	}

	var newData = entitiesDataReducer(state.data, action);

	if (newData === state.data && newConfig === state.config && entitiesDataReducer === state.reducer) {
		return state;
	}

	return {
		reducer: entitiesDataReducer,
		data: newData,
		config: newConfig
	};
};

export default combineReducers({
	terms: terms,
	users: users,
	taxonomies: taxonomies,
	themeSupports: themeSupports,
	entities: entities
});