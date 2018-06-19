'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.receiveTerms = receiveTerms;
exports.receiveUserQuery = receiveUserQuery;
exports.addEntities = addEntities;
exports.receiveEntityRecords = receiveEntityRecords;
exports.receiveThemeSupportsFromIndex = receiveThemeSupportsFromIndex;

var _lodash = require('lodash');

/**
 * Returns an action object used in signalling that terms have been received
 * for a given taxonomy.
 *
 * @param {string}   taxonomy Taxonomy name.
 * @param {Object[]} terms    Terms received.
 *
 * @return {Object} Action object.
 */
function receiveTerms(taxonomy, terms) {
  return {
    type: 'RECEIVE_TERMS',
    taxonomy: taxonomy,
    terms: terms
  };
}

/**
 * Returns an action object used in signalling that authors have been received.
 *
 * @param {string}       queryID Query ID.
 * @param {Array|Object} users   Users received.
 *
 * @return {Object} Action object.
 */
/**
 * External dependencies
 */
function receiveUserQuery(queryID, users) {
  return {
    type: 'RECEIVE_USER_QUERY',
    users: (0, _lodash.castArray)(users),
    queryID: queryID
  };
}

/**
 * Returns an action object used in adding new entities.
 *
 * @param {Array} entities  Entities received.
 *
 * @return {Object} Action object.
 */
function addEntities(entities) {
  return {
    type: 'ADD_ENTITIES',
    entities: entities
  };
}

/**
 * Returns an action object used in signalling that entity records have been received.
 *
 * @param {string}       kind    Kind of the received entity.
 * @param {string}       name    Name of the received entity.
 * @param {Array|Object} records Records received.
 *
 * @return {Object} Action object.
 */
function receiveEntityRecords(kind, name, records) {
  return {
    type: 'RECEIVE_ENTITY_RECORDS',
    records: (0, _lodash.castArray)(records),
    kind: kind,
    name: name
  };
}

/**
 * Returns an action object used in signalling that the index has been received.
 *
 * @param {Object} index Index received.
 *
 * @return {Object} Action object.
 */
function receiveThemeSupportsFromIndex(index) {
  return {
    type: 'RECEIVE_THEME_SUPPORTS',
    themeSupports: index.theme_supports
  };
}