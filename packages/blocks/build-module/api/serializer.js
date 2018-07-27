import "core-js/modules/es6.function.name";
import _JSON$stringify from "@babel/runtime/core-js/json/stringify";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.regexp.replace";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { isEmpty, reduce, isObject, castArray, startsWith } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component, cloneElement, renderToString } from '@wordpress/element';
import { hasFilter, applyFilters } from '@wordpress/hooks';
import isShallowEqual from '@wordpress/is-shallow-equal';
/**
 * Internal dependencies
 */

import { getBlockType, getUnknownTypeHandlerName } from './registration';
import BlockContentProvider from '../block-content-provider';
/**
 * Returns the block's default classname from its name.
 *
 * @param {string} blockName The block name.
 *
 * @return {string} The block's default class.
 */

export function getBlockDefaultClassName(blockName) {
  // Generated HTML classes for blocks follow the `wp-block-{name}` nomenclature.
  // Blocks provided by WordPress drop the prefixes 'core/' or 'core-' (used in 'core-embed/').
  var className = 'wp-block-' + blockName.replace(/\//, '-').replace(/^core-/, '');
  return applyFilters('blocks.getBlockDefaultClassName', className, blockName);
}
/**
 * Returns the block's default menu item classname from its name.
 *
 * @param {string} blockName The block name.
 *
 * @return {string} The block's default menu item class.
 */

export function getBlockMenuDefaultClassName(blockName) {
  // Generated HTML classes for blocks follow the `editor-block-list-item-{name}` nomenclature.
  // Blocks provided by WordPress drop the prefixes 'core/' or 'core-' (used in 'core-embed/').
  var className = 'editor-block-list-item-' + blockName.replace(/\//, '-').replace(/^core-/, '');
  return applyFilters('blocks.getBlockMenuDefaultClassName', className, blockName);
}
/**
 * Given a block type containing a save render implementation and attributes, returns the
 * enhanced element to be saved or string when raw HTML expected.
 *
 * @param {Object} blockType   Block type.
 * @param {Object} attributes  Block attributes.
 * @param {?Array} innerBlocks Nested blocks.
 *
 * @return {Object|string} Save element or raw HTML string.
 */

export function getSaveElement(blockType, attributes) {
  var innerBlocks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var save = blockType.save; // Component classes are unsupported for save since serialization must
  // occur synchronously. For improved interoperability with higher-order
  // components which often return component class, emulate basic support.

  if (save.prototype instanceof Component) {
    var instance = new save({
      attributes: attributes
    });
    save = instance.render.bind(instance);
  }

  var element = save({
    attributes: attributes,
    innerBlocks: innerBlocks
  });

  if (isObject(element) && hasFilter('blocks.getSaveContent.extraProps')) {
    /**
     * Filters the props applied to the block save result element.
     *
     * @param {Object}      props      Props applied to save element.
     * @param {WPBlockType} blockType  Block type definition.
     * @param {Object}      attributes Block attributes.
     */
    var props = applyFilters('blocks.getSaveContent.extraProps', _objectSpread({}, element.props), blockType, attributes);

    if (!isShallowEqual(props, element.props)) {
      element = cloneElement(element, props);
    }
  }
  /**
   * Filters the save result of a block during serialization.
   *
   * @param {WPElement}   element    Block save result.
   * @param {WPBlockType} blockType  Block type definition.
   * @param {Object}      attributes Block attributes.
   */


  element = applyFilters('blocks.getSaveElement', element, blockType, attributes);
  return createElement(BlockContentProvider, {
    innerBlocks: innerBlocks
  }, element);
}
/**
 * Given a block type containing a save render implementation and attributes, returns the
 * static markup to be saved.
 *
 * @param {Object} blockType   Block type.
 * @param {Object} attributes  Block attributes.
 * @param {?Array} innerBlocks Nested blocks.
 *
 * @return {string} Save content.
 */

export function getSaveContent(blockType, attributes, innerBlocks) {
  return renderToString(getSaveElement(blockType, attributes, innerBlocks));
}
/**
 * Returns attributes which are to be saved and serialized into the block
 * comment delimiter.
 *
 * When a block exists in memory it contains as its attributes both those
 * parsed the block comment delimiter _and_ those which matched from the
 * contents of the block.
 *
 * This function returns only those attributes which are needed to persist and
 * which cannot be matched from the block content.
 *
 * @param {Object<string,*>} allAttributes Attributes from in-memory block data.
 * @param {Object<string,*>} blockType     Block type.
 *
 * @return {Object<string,*>} Subset of attributes for comment serialization.
 */

export function getCommentAttributes(allAttributes, blockType) {
  var attributes = reduce(blockType.attributes, function (result, attributeSchema, key) {
    var value = allAttributes[key]; // Ignore undefined values.

    if (undefined === value) {
      return result;
    } // Ignore all attributes but the ones with an "undefined" source
    // "undefined" source refers to attributes saved in the block comment.


    if (attributeSchema.source !== undefined) {
      return result;
    } // Ignore default value.


    if ('default' in attributeSchema && attributeSchema.default === value) {
      return result;
    } // Otherwise, include in comment set.


    result[key] = value;
    return result;
  }, {});
  return attributes;
}
/**
 * Given an attributes object, returns a string in the serialized attributes
 * format prepared for post content.
 *
 * @param {Object} attributes Attributes object.
 *
 * @return {string} Serialized attributes.
 */

export function serializeAttributes(attributes) {
  return _JSON$stringify(attributes) // Don't break HTML comments.
  .replace(/--/g, "\\u002d\\u002d") // Don't break non-standard-compliant tools.
  .replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026") // Bypass server stripslashes behavior which would unescape stringify's
  // escaping of quotation mark.
  //
  // See: https://developer.wordpress.org/reference/functions/wp_kses_stripslashes/
  .replace(/\\"/g, "\\u0022");
}
/**
 * Given a block object, returns the Block's Inner HTML markup.
 *
 * @param {Object} block Block Object.
 *
 * @return {string} HTML.
 */

export function getBlockContent(block) {
  // @todo why not getBlockInnerHtml?
  var blockType = getBlockType(block.name); // If block was parsed as invalid or encounters an error while generating
  // save content, use original content instead to avoid content loss. If a
  // block contains nested content, exempt it from this condition because we
  // otherwise have no access to its original content and content loss would
  // still occur.

  var saveContent = block.originalContent;

  if (block.isValid || block.innerBlocks.length) {
    try {
      saveContent = getSaveContent(blockType, block.attributes, block.innerBlocks);
    } catch (error) {}
  }

  return saveContent;
}
/**
 * Returns the content of a block, including comment delimiters.
 *
 * @param {string} rawBlockName Block name.
 * @param {Object} attributes   Block attributes.
 * @param {string} content      Block save content.
 *
 * @return {string} Comment-delimited block content.
 */

export function getCommentDelimitedContent(rawBlockName, attributes, content) {
  var serializedAttributes = !isEmpty(attributes) ? serializeAttributes(attributes) + ' ' : ''; // Strip core blocks of their namespace prefix.

  var blockName = startsWith(rawBlockName, 'core/') ? rawBlockName.slice(5) : rawBlockName; // @todo make the `wp:` prefix potentially configurable.

  if (!content) {
    return "<!-- wp:".concat(blockName, " ").concat(serializedAttributes, "/-->");
  }

  return "<!-- wp:".concat(blockName, " ").concat(serializedAttributes, "-->\n") + content + "\n<!-- /wp:".concat(blockName, " -->");
}
/**
 * Returns the content of a block, including comment delimiters, determining
 * serialized attributes and content form from the current state of the block.
 *
 * @param {Object} block Block instance.
 *
 * @return {string} Serialized block.
 */

export function serializeBlock(block) {
  var blockName = block.name;
  var blockType = getBlockType(blockName);
  var saveContent = getBlockContent(block);
  var saveAttributes = getCommentAttributes(block.attributes, blockType);

  switch (blockName) {
    case getUnknownTypeHandlerName():
      return saveContent;

    default:
      return getCommentDelimitedContent(blockName, saveAttributes, saveContent);
  }
}
/**
 * Takes a block or set of blocks and returns the serialized post content.
 *
 * @param {Array} blocks Block(s) to serialize.
 *
 * @return {string} The post content.
 */

export default function serialize(blocks) {
  return castArray(blocks).map(serializeBlock).join('\n\n');
}