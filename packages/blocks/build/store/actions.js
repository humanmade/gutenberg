"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addBlockTypes = addBlockTypes;
exports.removeBlockTypes = removeBlockTypes;
exports.setDefaultBlockName = setDefaultBlockName;
exports.setFallbackBlockName = setFallbackBlockName;
exports.setCategories = setCategories;

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Returns an action object used in signalling that block types have been added.
 *
 * @param {Array|Object} blockTypes Block types received.
 *
 * @return {Object} Action object.
 */
function addBlockTypes(blockTypes) {
  return {
    type: 'ADD_BLOCK_TYPES',
    blockTypes: (0, _lodash.castArray)(blockTypes)
  };
}
/**
 * Returns an action object used to remove a registered block type.
 *
 * @param {string|Array} names Block name.
 *
 * @return {Object} Action object.
 */


function removeBlockTypes(names) {
  return {
    type: 'REMOVE_BLOCK_TYPES',
    names: (0, _lodash.castArray)(names)
  };
}
/**
 * Returns an action object used to set the default block name.
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */


function setDefaultBlockName(name) {
  return {
    type: 'SET_DEFAULT_BLOCK_NAME',
    name: name
  };
}
/**
 * Returns an action object used to set the fallback block name.
 *
 * @param {string} name Block name.
 *
 * @return {Object} Action object.
 */


function setFallbackBlockName(name) {
  return {
    type: 'SET_FALLBACK_BLOCK_NAME',
    name: name
  };
}
/**
 * Returns an action object used to set block categories.
 *
 * @param {Object[]} categories Block categories.
 *
 * @return {Object} Action object.
 */


function setCategories(categories) {
  return {
    type: 'SET_CATEGORIES',
    categories: categories
  };
}