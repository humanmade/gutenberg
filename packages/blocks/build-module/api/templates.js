import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.function.name";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

/**
 * External dependencies
 */
import { every, map } from 'lodash';
/**
 * Internal dependencies
 */

import { createBlock } from './factory';
/**
 * Checks whether a list of blocks matches a template by comparing the block names.
 *
 * @param {Array} blocks    Block list.
 * @param {Array} template  Block template.
 *
 * @return {boolean}        Whether the list of blocks matches a templates
 */

export function doBlocksMatchTemplate() {
  var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return blocks.length === template.length && every(template, function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 3),
        name = _ref2[0],
        innerBlocksTemplate = _ref2[2];

    var block = blocks[index];
    return name === block.name && doBlocksMatchTemplate(block.innerBlocks, innerBlocksTemplate);
  });
}
/**
 * Synchronize a block list with a block template.
 *
 * Synchronizing a block list with a block template means that we loop over the blocks
 * keep the block as is if it matches the block at the same position in the template
 * (If it has the same name) and if doesn't match, we create a new block based on the template.
 * Extra blocks not present in the template are removed.
 *
 * @param {Array} blocks    Block list.
 * @param {Array} template  Block template.
 *
 * @return {Array}          Updated Block list.
 */

export function synchronizeBlocksWithTemplate() {
  var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var template = arguments.length > 1 ? arguments[1] : undefined;

  // If no template is provided, return blocks unmodified.
  if (!template) {
    return blocks;
  }

  return map(template, function (_ref3, index) {
    var _ref4 = _slicedToArray(_ref3, 3),
        name = _ref4[0],
        attributes = _ref4[1],
        innerBlocksTemplate = _ref4[2];

    var block = blocks[index];

    if (block && block.name === name) {
      var innerBlocks = synchronizeBlocksWithTemplate(block.innerBlocks, innerBlocksTemplate);
      return _objectSpread({}, block, {
        innerBlocks: innerBlocks
      });
    }

    return createBlock(name, attributes, synchronizeBlocksWithTemplate([], innerBlocksTemplate));
  });
}