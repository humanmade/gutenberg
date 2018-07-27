import "core-js/modules/es6.function.name";
import _Object$values from "@babel/runtime/core-js/object/values";

/**
 * External dependencies
 */
import createSelector from 'rememo';
import { filter, includes, map } from 'lodash';
/**
 * Returns all the available block types.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Block Types.
 */

export var getBlockTypes = createSelector(function (state) {
  return _Object$values(state.blockTypes);
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

export function getBlockType(state, name) {
  return state.blockTypes[name];
}
/**
 * Returns all the available categories.
 *
 * @param {Object} state Data state.
 *
 * @return {Array} Categories list.
 */

export function getCategories(state) {
  return state.categories;
}
/**
 * Returns the name of the default block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Default block name.
 */

export function getDefaultBlockName(state) {
  return state.defaultBlockName;
}
/**
 * Returns the name of the fallback block name.
 *
 * @param {Object} state Data state.
 *
 * @return {string?} Fallback block name.
 */

export function getFallbackBlockName(state) {
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

export var getChildBlockNames = createSelector(function (state, blockName) {
  return map(filter(state.blockTypes, function (blockType) {
    return includes(blockType.parent, blockName);
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

export var hasChildBlocks = function hasChildBlocks(state, blockName) {
  return getChildBlockNames(state, blockName).length > 0;
};