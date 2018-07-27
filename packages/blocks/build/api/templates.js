"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doBlocksMatchTemplate = doBlocksMatchTemplate;
exports.synchronizeBlocksWithTemplate = synchronizeBlocksWithTemplate;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

require("core-js/modules/es6.function.name");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _lodash = require("lodash");

var _factory = require("./factory");

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Checks whether a list of blocks matches a template by comparing the block names.
 *
 * @param {Array} blocks    Block list.
 * @param {Array} template  Block template.
 *
 * @return {boolean}        Whether the list of blocks matches a templates
 */
function doBlocksMatchTemplate() {
  var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return blocks.length === template.length && (0, _lodash.every)(template, function (_ref, index) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 3),
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


function synchronizeBlocksWithTemplate() {
  var blocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var template = arguments.length > 1 ? arguments[1] : undefined;

  // If no template is provided, return blocks unmodified.
  if (!template) {
    return blocks;
  }

  return (0, _lodash.map)(template, function (_ref3, index) {
    var _ref4 = (0, _slicedToArray2.default)(_ref3, 3),
        name = _ref4[0],
        attributes = _ref4[1],
        innerBlocksTemplate = _ref4[2];

    var block = blocks[index];

    if (block && block.name === name) {
      var innerBlocks = synchronizeBlocksWithTemplate(block.innerBlocks, innerBlocksTemplate);
      return (0, _objectSpread2.default)({}, block, {
        innerBlocks: innerBlocks
      });
    }

    return (0, _factory.createBlock)(name, attributes, synchronizeBlocksWithTemplate([], innerBlocksTemplate));
  });
}