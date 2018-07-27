"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asType = asType;
exports.matcherFromSource = matcherFromSource;
exports.parseWithAttributeSchema = parseWithAttributeSchema;
exports.getBlockAttribute = getBlockAttribute;
exports.getBlockAttributes = getBlockAttributes;
exports.getMigratedBlock = getMigratedBlock;
exports.createBlockWithFallback = createBlockWithFallback;
exports.default = exports.parseWithGrammar = exports.toBooleanAttributeMatcher = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.number.constructor");

var _from = _interopRequireDefault(require("@babel/runtime/core-js/array/from"));

var _hpq = require("hpq");

var _lodash = require("lodash");

var _autop = require("@wordpress/autop");

var _hooks = require("@wordpress/hooks");

var _deprecated = _interopRequireDefault(require("@wordpress/deprecated"));

var _blockSerializationSpecParser = require("@wordpress/block-serialization-spec-parser");

var _registration = require("./registration");

var _factory = require("./factory");

var _validation = require("./validation");

var _serializer = require("./serializer");

var _matchers = require("./matchers");

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
 * Higher-order hpq matcher which enhances an attribute matcher to return true
 * or false depending on whether the original matcher returns undefined. This
 * is useful for boolean attributes (e.g. disabled) whose attribute values may
 * be technically falsey (empty string), though their mere presence should be
 * enough to infer as true.
 *
 * @param {Function} matcher Original hpq matcher.
 *
 * @return {Function} Enhanced hpq matcher.
 */
var toBooleanAttributeMatcher = function toBooleanAttributeMatcher(matcher) {
  return (0, _lodash.flow)([matcher, // Expected values from `attr( 'disabled' )`:
  //
  // <input>
  // - Value:       `undefined`
  // - Transformed: `false`
  //
  // <input disabled>
  // - Value:       `''`
  // - Transformed: `true`
  //
  // <input disabled="disabled">
  // - Value:       `'disabled'`
  // - Transformed: `true`
  function (value) {
    return value !== undefined;
  }]);
};
/**
 * Returns value coerced to the specified JSON schema type string.
 *
 * @see http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.25
 *
 * @param {*}      value Original value.
 * @param {string} type  Type to coerce.
 *
 * @return {*} Coerced value.
 */


exports.toBooleanAttributeMatcher = toBooleanAttributeMatcher;

function asType(value, type) {
  switch (type) {
    case 'string':
      return String(value);

    case 'boolean':
      return Boolean(value);

    case 'object':
      return Object(value);

    case 'null':
      return null;

    case 'array':
      if (Array.isArray(value)) {
        return value;
      }

      return (0, _from.default)(value);

    case 'integer':
    case 'number':
      return Number(value);
  }

  return value;
}
/**
 * Returns an hpq matcher given a source object.
 *
 * @param {Object} sourceConfig Attribute Source object.
 *
 * @return {Function} A hpq Matcher.
 */


function matcherFromSource(sourceConfig) {
  switch (sourceConfig.source) {
    case 'attribute':
      var matcher = (0, _matchers.attr)(sourceConfig.selector, sourceConfig.attribute);

      if (sourceConfig.type === 'boolean') {
        matcher = toBooleanAttributeMatcher(matcher);
      }

      return matcher;

    case 'property':
      (0, _deprecated.default)('`property` source', {
        version: '3.4',
        alternative: 'equivalent `text`, `html`, or `attribute` source, or comment attribute',
        plugin: 'Gutenberg'
      });
      return (0, _matchers.prop)(sourceConfig.selector, sourceConfig.property);

    case 'html':
      return (0, _matchers.html)(sourceConfig.selector);

    case 'text':
      return (0, _matchers.text)(sourceConfig.selector);

    case 'children':
      return (0, _matchers.children)(sourceConfig.selector);

    case 'node':
      return (0, _matchers.node)(sourceConfig.selector);

    case 'query':
      var subMatchers = (0, _lodash.mapValues)(sourceConfig.query, matcherFromSource);
      return (0, _matchers.query)(sourceConfig.selector, subMatchers);

    default:
      // eslint-disable-next-line no-console
      console.error("Unknown source type \"".concat(sourceConfig.source, "\""));
  }
}
/**
 * Given a block's raw content and an attribute's schema returns the attribute's
 * value depending on its source.
 *
 * @param {string} innerHTML         Block's raw content.
 * @param {Object} attributeSchema   Attribute's schema.
 *
 * @return {*} Attribute value.
 */


function parseWithAttributeSchema(innerHTML, attributeSchema) {
  return (0, _hpq.parse)(innerHTML, matcherFromSource(attributeSchema));
}
/**
 * Given an attribute key, an attribute's schema, a block's raw content and the
 * commentAttributes returns the attribute value depending on its source
 * definition of the given attribute key.
 *
 * @param {string} attributeKey      Attribute key.
 * @param {Object} attributeSchema   Attribute's schema.
 * @param {string} innerHTML         Block's raw content.
 * @param {Object} commentAttributes Block's comment attributes.
 *
 * @return {*} Attribute value.
 */


function getBlockAttribute(attributeKey, attributeSchema, innerHTML, commentAttributes) {
  var value;

  switch (attributeSchema.source) {
    // undefined source means that it's an attribute serialized to the block's "comment"
    case undefined:
      value = commentAttributes ? commentAttributes[attributeKey] : undefined;
      break;

    case 'attribute':
    case 'property':
    case 'html':
    case 'text':
    case 'children':
    case 'node':
    case 'query':
      value = parseWithAttributeSchema(innerHTML, attributeSchema);
      break;
  }

  return value === undefined ? attributeSchema.default : asType(value, attributeSchema.type);
}
/**
 * Returns the block attributes of a registered block node given its type.
 *
 * @param {?Object} blockType  Block type.
 * @param {string}  innerHTML  Raw block content.
 * @param {?Object} attributes Known block attributes (from delimiters).
 *
 * @return {Object} All block attributes.
 */


function getBlockAttributes(blockType, innerHTML, attributes) {
  var blockAttributes = (0, _lodash.mapValues)(blockType.attributes, function (attributeSchema, attributeKey) {
    return getBlockAttribute(attributeKey, attributeSchema, innerHTML, attributes);
  });
  return (0, _hooks.applyFilters)('blocks.getBlockAttributes', blockAttributes, blockType, innerHTML, attributes);
}
/**
 * Given a block object, returns a new copy of the block with any applicable
 * deprecated migrations applied, or the original block if it was both valid
 * and no eligible migrations exist.
 *
 * @param {WPBlock} block Original block object.
 *
 * @return {WPBlock} Migrated block object.
 */


function getMigratedBlock(block) {
  var blockType = (0, _registration.getBlockType)(block.name);
  var deprecatedDefinitions = blockType.deprecated;

  if (!deprecatedDefinitions || !deprecatedDefinitions.length) {
    return block;
  }

  var _block = block,
      originalContent = _block.originalContent,
      attributes = _block.attributes,
      innerBlocks = _block.innerBlocks;

  for (var i = 0; i < deprecatedDefinitions.length; i++) {
    // A block can opt into a migration even if the block is valid by
    // defining isEligible on its deprecation. If the block is both valid
    // and does not opt to migrate, skip.
    var _deprecatedDefinition = deprecatedDefinitions[i].isEligible,
        isEligible = _deprecatedDefinition === void 0 ? _lodash.stubFalse : _deprecatedDefinition;

    if (block.isValid && !isEligible(attributes, innerBlocks)) {
      continue;
    } // Block type properties which could impact either serialization or
    // parsing are not considered in the deprecated block type by default,
    // and must be explicitly provided.


    var deprecatedBlockType = (0, _assign.default)((0, _lodash.omit)(blockType, ['attributes', 'save', 'supports']), deprecatedDefinitions[i]);
    var migratedAttributes = getBlockAttributes(deprecatedBlockType, originalContent, attributes); // Ignore the deprecation if it produces a block which is not valid.

    var isValid = (0, _validation.isValidBlock)(originalContent, deprecatedBlockType, migratedAttributes);

    if (!isValid) {
      continue;
    }

    block = (0, _objectSpread2.default)({}, block, {
      isValid: true
    });
    var migratedInnerBlocks = innerBlocks; // A block may provide custom behavior to assign new attributes and/or
    // inner blocks.

    var migrate = deprecatedBlockType.migrate;

    if (migrate) {
      var _castArray = (0, _lodash.castArray)(migrate(migratedAttributes, innerBlocks));

      var _castArray2 = (0, _slicedToArray2.default)(_castArray, 2);

      var _castArray2$ = _castArray2[0];
      migratedAttributes = _castArray2$ === void 0 ? attributes : _castArray2$;
      var _castArray2$2 = _castArray2[1];
      migratedInnerBlocks = _castArray2$2 === void 0 ? innerBlocks : _castArray2$2;
    }

    block.attributes = migratedAttributes;
    block.innerBlocks = migratedInnerBlocks;
  }

  return block;
}
/**
 * Creates a block with fallback to the unknown type handler.
 *
 * @param {Object} blockNode Parsed block node.
 *
 * @return {?Object} An initialized block object (if possible).
 */


function createBlockWithFallback(blockNode) {
  var name = blockNode.blockName,
      attributes = blockNode.attrs,
      _blockNode$innerBlock = blockNode.innerBlocks,
      innerBlocks = _blockNode$innerBlock === void 0 ? [] : _blockNode$innerBlock,
      innerHTML = blockNode.innerHTML;
  attributes = attributes || {}; // Trim content to avoid creation of intermediary freeform segments.

  innerHTML = innerHTML.trim(); // Use type from block content, otherwise find unknown handler.

  name = name || (0, _registration.getUnknownTypeHandlerName)(); // Convert 'core/text' blocks in existing content to 'core/paragraph'.

  if ('core/text' === name || 'core/cover-text' === name) {
    name = 'core/paragraph';
  } // Try finding the type for known block name, else fall back again.


  var blockType = (0, _registration.getBlockType)(name);
  var fallbackBlock = (0, _registration.getUnknownTypeHandlerName)(); // Fallback content may be upgraded from classic editor expecting implicit
  // automatic paragraphs, so preserve them. Assumes wpautop is idempotent,
  // meaning there are no negative consequences to repeated autop calls.

  if (name === fallbackBlock) {
    innerHTML = (0, _autop.autop)(innerHTML).trim();
  }

  if (!blockType) {
    // If detected as a block which is not registered, preserve comment
    // delimiters in content of unknown type handler.
    if (name) {
      innerHTML = (0, _serializer.getCommentDelimitedContent)(name, attributes, innerHTML);
    }

    name = fallbackBlock;
    blockType = (0, _registration.getBlockType)(name);
  } // Coerce inner blocks from parsed form to canonical form.


  innerBlocks = innerBlocks.map(createBlockWithFallback); // Include in set only if type were determined.

  if (!blockType || !innerHTML && name === fallbackBlock) {
    return;
  }

  var block = (0, _factory.createBlock)(name, getBlockAttributes(blockType, innerHTML, attributes), innerBlocks); // Block validation assumes an idempotent operation from source block to serialized block
  // provided there are no changes in attributes. The validation procedure thus compares the
  // provided source value with the serialized output before there are any modifications to
  // the block. When both match, the block is marked as valid.

  if (name !== fallbackBlock) {
    block.isValid = (0, _validation.isValidBlock)(innerHTML, blockType, block.attributes);
  } // Preserve original content for future use in case the block is parsed as
  // invalid, or future serialization attempt results in an error.


  block.originalContent = innerHTML;
  block = getMigratedBlock(block);
  return block;
}
/**
 * Creates a parse implementation for the post content which returns a list of blocks.
 *
 * @param {Function} parseImplementation Parse implementation.
 *
 * @return {Function} An implementation which parses the post content.
 */


var createParse = function createParse(parseImplementation) {
  return function (content) {
    return parseImplementation(content).reduce(function (memo, blockNode) {
      var block = createBlockWithFallback(blockNode);

      if (block) {
        memo.push(block);
      }

      return memo;
    }, []);
  };
};
/**
 * Parses the post content with a PegJS grammar and returns a list of blocks.
 *
 * @param {string} content The post content.
 *
 * @return {Array} Block list.
 */


var parseWithGrammar = createParse(_blockSerializationSpecParser.parse);
exports.parseWithGrammar = parseWithGrammar;
var _default = parseWithGrammar;
exports.default = _default;