"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.terms = terms;
exports.users = users;
exports.taxonomies = taxonomies;
exports.themeSupports = themeSupports;
exports.entitiesConfig = entitiesConfig;
exports.default = exports.entities = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

require("core-js/modules/es6.function.name");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread5 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _lodash = require("lodash");

var _data = require("@wordpress/data");

var _entities = require("./entities");

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
function terms() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'RECEIVE_TERMS':
      return (0, _objectSpread5.default)({}, state, (0, _defineProperty2.default)({}, action.taxonomy, action.terms));
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


function users() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    byId: {},
    queries: {}
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'RECEIVE_USER_QUERY':
      return {
        byId: (0, _objectSpread5.default)({}, state.byId, (0, _lodash.keyBy)(action.users, 'id')),
        queries: (0, _objectSpread5.default)({}, state.queries, (0, _defineProperty2.default)({}, action.queryID, (0, _lodash.map)(action.users, function (user) {
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


function taxonomies() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 ? arguments[1] : undefined;

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


function themeSupports() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'RECEIVE_THEME_SUPPORTS':
      return (0, _objectSpread5.default)({}, state, action.themeSupports);
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
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      byKey: {}
    };
    var action = arguments.length > 1 ? arguments[1] : undefined;

    if (!action.name || !action.kind || action.name !== entityConfig.name || action.kind !== entityConfig.kind) {
      return state;
    }

    switch (action.type) {
      case 'RECEIVE_ENTITY_RECORDS':
        return {
          byKey: (0, _objectSpread5.default)({}, state.byKey, (0, _lodash.keyBy)(action.records, key))
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


function entitiesConfig() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _entities.defaultEntities;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ADD_ENTITIES':
      return (0, _toConsumableArray2.default)(state).concat((0, _toConsumableArray2.default)(action.entities));
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


var entities = function entities() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var newConfig = entitiesConfig(state.config, action); // Generates a dynamic reducer for the entities

  var entitiesDataReducer = state.reducer;

  if (!entitiesDataReducer || newConfig !== state.config) {
    var entitiesByKind = (0, _lodash.groupBy)(newConfig, 'kind');
    entitiesDataReducer = (0, _data.combineReducers)((0, _entries.default)(entitiesByKind).reduce(function (memo, _ref) {
      var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
          kind = _ref2[0],
          subEntities = _ref2[1];

      var kindReducer = (0, _data.combineReducers)(subEntities.reduce(function (kindMemo, entityConfig) {
        return (0, _objectSpread5.default)({}, kindMemo, (0, _defineProperty2.default)({}, entityConfig.name, entity(entityConfig)));
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

exports.entities = entities;

var _default = (0, _data.combineReducers)({
  terms: terms,
  users: users,
  taxonomies: taxonomies,
  themeSupports: themeSupports,
  entities: entities
});

exports.default = _default;