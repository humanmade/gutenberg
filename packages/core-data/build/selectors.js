'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntityRecords = exports.getUserQueryResults = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

exports.getTerms = getTerms;
exports.getCategories = getCategories;
exports.isRequestingTerms = isRequestingTerms;
exports.isRequestingCategories = isRequestingCategories;
exports.getAuthors = getAuthors;
exports.getEntitiesByKind = getEntitiesByKind;
exports.getEntity = getEntity;
exports.getEntityRecord = getEntityRecord;
exports.getThemeSupports = getThemeSupports;

var _rememo = require('rememo');

var _rememo2 = _interopRequireDefault(_rememo);

var _lodash = require('lodash');

var _data = require('@wordpress/data');

var _name = require('./name');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns true if resolution is in progress for the core selector of the given
 * name and arguments.
 *
 * @param {string} selectorName Core data selector name.
 * @param {...*}   args         Arguments passed to selector.
 *
 * @return {boolean} Whether resolution is in progress.
 */


/**
 * WordPress dependencies
 */
/**
 * External dependencies
 */
function isResolving(selectorName) {
  var _select;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return (_select = (0, _data.select)('core/data')).isResolving.apply(_select, [_name.REDUCER_KEY, selectorName].concat(args));
}

/**
 * Returns all the available terms for the given taxonomy.
 *
 * @param {Object} state    Data state.
 * @param {string} taxonomy Taxonomy name.
 *
 * @return {Array} Categories list.
 */


/**
 * Internal dependencies
 */
function getTerms(state, taxonomy) {
  return state.terms[taxonomy];
}

/**
 * Returns all the available categories.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Categories list.
 */
function getCategories(state) {
  return getTerms(state, 'categories');
}

/**
 * Returns true if a request is in progress for terms data of a given taxonomy,
 * or false otherwise.
 *
 * @param {Object} state    Data state.
 * @param {string} taxonomy Taxonomy name.
 *
 * @return {boolean} Whether a request is in progress for taxonomy's terms.
 */
function isRequestingTerms(state, taxonomy) {
  return isResolving('getTerms', taxonomy);
}

/**
 * Returns true if a request is in progress for categories data, or false
 * otherwise.
 *
 * @param {Object} state Data state.
 *
 * @return {boolean} Whether a request is in progress for categories.
 */
function isRequestingCategories() {
  return isResolving('getCategories');
}

/**
 * Returns all available authors.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Authors list.
 */
function getAuthors(state) {
  return getUserQueryResults(state, 'authors');
}

/**
 * Returns all the users returned by a query ID.
 *
 * @param {Object} state   Data state.
 * @param {string} queryID Query ID.
 *
 * @return {Array} Users list.
 */
var getUserQueryResults = exports.getUserQueryResults = (0, _rememo2.default)(function (state, queryID) {
  var queryResults = state.users.queries[queryID];

  return (0, _lodash.map)(queryResults, function (id) {
    return state.users.byId[id];
  });
}, function (state, queryID) {
  return [state.users.queries[queryID], state.users.byId];
});

/**
 * Returns whether the entities for the give kind are loaded.
 *
 * @param {Object} state   Data state.
 * @param {string} kind  Entity kind.
 *
 * @return {boolean} Whether the entities are loaded
 */
function getEntitiesByKind(state, kind) {
  return (0, _lodash.filter)(state.entities.config, { kind: kind });
}

/**
 * Returns the entity object given its kind and name.
 *
 * @param {Object} state   Data state.
 * @param {string} kind  Entity kind.
 * @param {string} name  Entity name.
 *
 * @return {Object} Entity
 */
function getEntity(state, kind, name) {
  return (0, _lodash.find)(state.entities.config, { kind: kind, name: name });
}

/**
 * Returns the Entity's record object by key.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 * @param {number} key    Record's key
 *
 * @return {Object?} Record.
 */
function getEntityRecord(state, kind, name, key) {
  return (0, _lodash.get)(state.entities.data, [kind, name, 'byKey', key]);
}

/**
 * Returns the Entity's records.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 *
 * @return {Array} Records.
 */
var getEntityRecords = exports.getEntityRecords = (0, _rememo2.default)(function (state, kind, name) {
  return (0, _values2.default)((0, _lodash.get)(state.entities.data, [kind, name, 'byKey']));
}, function (state, kind, name) {
  return [(0, _lodash.get)(state.entities.data, [kind, name, 'byKey'])];
});

/**
 * Return theme supports data in the index.
 *
 * @param {Object} state Data state.
 *
 * @return {*}           Index data.
 */
function getThemeSupports(state) {
  return state.themeSupports;
}