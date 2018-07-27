"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBlockType = getBlockType;
exports.getCategories = getCategories;
exports.getDefaultBlockName = getDefaultBlockName;
exports.getFallbackBlockName = getFallbackBlockName;
exports.hasChildBlocks = exports.getChildBlockNames = exports.getBlockTypes = void 0;

require("core-js/modules/es6.function.name");

var _values = _interopRequireDefault(require("@babel/runtime/core-js/object/values"));

var _rememo = _interopRequireDefault(require("rememo"));

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Returns all the available block types.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Block Types.
 */
var getBlockTypes = (0, _rememo.default)(function (state) {
  return (0, _values.default)(state.blockTypes);
}, function (state) {
  return [state.blockTypes];
});
/**
 * Returns a block type by name.
 *
 * @param {Object} state Data state.
 * @param {string} name Block type name.
 *
 * @return {Object?} Block Type.
 */

exports.getBlockTypes = getBlockTypes;

function getBlockType(state, name) {
  return state.blockTypes[name];
}
/**
 * Returns all the available categories.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Categories list.
 */


function getCategories(state) {
  return state.categories;
}
/**
 * Returns the name of the default block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Default block name.
 */


function getDefaultBlockName(state) {
  return state.defaultBlockName;
}
/**
 * Returns the name of the fallback block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Fallback block name.
 */


function getFallbackBlockName(state) {
  return state.fallbackBlockName;
}
/**
 * Returns an array with the child blocks of a given block.
 *
 * @param {Object} state     Data state.
 * @param {string} blockName Block type name.
 *
 * @return {Array} Array of child block names.
 */


var getChildBlockNames = (0, _rememo.default)(function (state, blockName) {
  return (0, _lodash.map)((0, _lodash.filter)(state.blockTypes, function (blockType) {
    return (0, _lodash.includes)(blockType.parent, blockName);
  }), function (_ref) {
    var name = _ref.name;
    return name;
  });
}, function (state) {
  return [state.blockTypes];
});
/**
 * Returns a boolean indicating if a block has child blocks or not.
 *
 * @param {Object} state     Data state.
 * @param {string} blockName Block type name.
 *
 * @return {boolean} True if a block contains child blocks and false otherwise.
 */

exports.getChildBlockNames = getChildBlockNames;

var hasChildBlocks = function hasChildBlocks(state, blockName) {
  return getChildBlockNames(state, blockName).length > 0;
};

exports.hasChildBlocks = hasChildBlocks;