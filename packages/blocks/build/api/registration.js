"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unstable__bootstrapServerSideBlockDefinitions = unstable__bootstrapServerSideBlockDefinitions;
exports.registerBlockType = registerBlockType;
exports.unregisterBlockType = unregisterBlockType;
exports.setUnknownTypeHandlerName = setUnknownTypeHandlerName;
exports.getUnknownTypeHandlerName = getUnknownTypeHandlerName;
exports.setDefaultBlockName = setDefaultBlockName;
exports.getDefaultBlockName = getDefaultBlockName;
exports.getDefaultBlockForPostFormat = getDefaultBlockForPostFormat;
exports.getBlockType = getBlockType;
exports.getBlockTypes = getBlockTypes;
exports.getBlockSupport = getBlockSupport;
exports.hasBlockSupport = hasBlockSupport;
exports.isReusableBlock = isReusableBlock;
exports.isSharedBlock = isSharedBlock;
exports.registerBlockStyle = exports.hasChildBlocks = exports.getChildBlockNames = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

require("core-js/modules/es6.function.name");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _lodash = require("lodash");

var _hooks = require("@wordpress/hooks");

var _data = require("@wordpress/data");

var _deprecated = _interopRequireDefault(require("@wordpress/deprecated"));

var _utils = require("./utils");

/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */

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
 * Defined behavior of a block type.
 *
 * @typedef {WPBlockType}
 *
 * @property {string}                    name       Block's namespaced name.
 * @property {string}                    title      Human-readable label for a block.
 *                                                  Shown in the block inserter.
 * @property {string}                    category   Category classification of block,
 *                                                  impacting where block is shown in
 *                                                  inserter results.
 * @property {(Object|string|WPElement)} icon       Slug of the Dashicon to be shown
 *                                                  as the icon for the block in the
 *                                                  inserter, or element or an object describing the icon.
 * @property {?string[]}                 keywords   Additional keywords to produce
 *                                                  block as inserter search result.
 * @property {?Object}                   attributes Block attributes.
 * @property {Function}                  save       Serialize behavior of a block,
 *                                                  returning an element describing
 *                                                  structure of the block's post
 *                                                  content markup.
 * @property {WPComponent}               edit       Component rendering element to be
 *                                                  interacted with in an editor.
 */

/**
 * Constant mapping post formats to the expected default block.
 *
 * @type {Object}
 */
var POST_FORMAT_BLOCK_MAP = {
  audio: 'core/audio',
  gallery: 'core/gallery',
  image: 'core/image',
  quote: 'core/quote',
  video: 'core/video'
};
var serverSideBlockDefinitions = {};
/**
 * Set the server side block definition of blocks.
 *
 * @param {Object} definitions Server-side block definitions
 */

function unstable__bootstrapServerSideBlockDefinitions(definitions) {
  // eslint-disable-line camelcase
  serverSideBlockDefinitions = definitions;
}
/**
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 *
 * @return {?WPBlock} The block, if it has been successfully registered;
 *                     otherwise `undefined`.
 */


function registerBlockType(name, settings) {
  settings = (0, _objectSpread2.default)({
    name: name
  }, (0, _lodash.get)(serverSideBlockDefinitions, name), settings);

  if (typeof name !== 'string') {
    console.error('Block names must be strings.');
    return;
  }

  if (!/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test(name)) {
    console.error('Block names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-block');
    return;
  }

  if ((0, _data.select)('core/blocks').getBlockType(name)) {
    console.error('Block "' + name + '" is already registered.');
    return;
  }

  settings = (0, _hooks.applyFilters)('blocks.registerBlockType', settings, name);

  if (!settings || !(0, _lodash.isFunction)(settings.save)) {
    console.error('The "save" property must be specified and must be a valid function.');
    return;
  }

  if ('edit' in settings && !(0, _lodash.isFunction)(settings.edit)) {
    console.error('The "edit" property must be a valid function.');
    return;
  }

  if ('keywords' in settings && settings.keywords.length > 3) {
    console.error('The block "' + name + '" can have a maximum of 3 keywords.');
    return;
  }

  if (!('category' in settings)) {
    console.error('The block "' + name + '" must have a category.');
    return;
  }

  if ('category' in settings && !(0, _lodash.some)((0, _data.select)('core/blocks').getCategories(), {
    slug: settings.category
  })) {
    console.error('The block "' + name + '" must have a registered category.');
    return;
  }

  if (!('title' in settings) || settings.title === '') {
    console.error('The block "' + name + '" must have a title.');
    return;
  }

  if (typeof settings.title !== 'string') {
    console.error('Block titles must be strings.');
    return;
  }

  settings.icon = (0, _utils.normalizeIconObject)(settings.icon);

  if (!(0, _utils.isValidIcon)(settings.icon.src)) {
    console.error('The icon passed is invalid. ' + 'The icon should be a string, an element, a function, or an object following the specifications documented in https://wordpress.org/gutenberg/handbook/block-api/#icon-optional');
    return;
  }

  if ((0, _utils.isIconUnreadable)(settings.icon) && window) {
    window.console.warn("The icon background color ".concat(settings.icon.background, " and the foreground color ").concat(settings.icon.foreground, " are not readable together. ") + 'Please try to increase the brightness and/or contrast difference between background and foreground.');
  }

  (0, _data.dispatch)('core/blocks').addBlockTypes(settings);
  return settings;
}
/**
 * Unregisters a block.
 *
 * @param {string} name Block name.
 *
 * @return {?WPBlock} The previous block value, if it has been successfully
 *                     unregistered; otherwise `undefined`.
 */


function unregisterBlockType(name) {
  var oldBlock = (0, _data.select)('core/blocks').getBlockType(name);

  if (!oldBlock) {
    console.error('Block "' + name + '" is not registered.');
    return;
  }

  (0, _data.dispatch)('core/blocks').removeBlockTypes(name);
  return oldBlock;
}
/**
 * Assigns name of block handling unknown block types.
 *
 * @param {string} name Block name.
 */


function setUnknownTypeHandlerName(name) {
  (0, _data.dispatch)('core/blocks').setFallbackBlockName(name);
}
/**
 * Retrieves name of block handling unknown block types, or undefined if no
 * handler has been defined.
 *
 * @return {?string} Blog name.
 */


function getUnknownTypeHandlerName() {
  return (0, _data.select)('core/blocks').getFallbackBlockName();
}
/**
 * Assigns the default block name.
 *
 * @param {string} name Block name.
 */


function setDefaultBlockName(name) {
  (0, _data.dispatch)('core/blocks').setDefaultBlockName(name);
}
/**
 * Retrieves the default block name.
 *
 * @return {?string} Block name.
 */


function getDefaultBlockName() {
  return (0, _data.select)('core/blocks').getDefaultBlockName();
}
/**
 * Retrieves the expected default block for the post format.
 *
 * @param	{string} postFormat Post format
 * @return {string}            Block name.
 */


function getDefaultBlockForPostFormat(postFormat) {
  var blockName = POST_FORMAT_BLOCK_MAP[postFormat];

  if (blockName && getBlockType(blockName)) {
    return blockName;
  }

  return null;
}
/**
 * Returns a registered block type.
 *
 * @param {string} name Block name.
 *
 * @return {?Object} Block type.
 */


function getBlockType(name) {
  return (0, _data.select)('core/blocks').getBlockType(name);
}
/**
 * Returns all registered blocks.
 *
 * @return {Array} Block settings.
 */


function getBlockTypes() {
  return (0, _data.select)('core/blocks').getBlockTypes();
}
/**
 * Returns the block support value for a feature, if defined.
 *
 * @param  {(string|Object)} nameOrType      Block name or type object
 * @param  {string}          feature         Feature to retrieve
 * @param  {*}               defaultSupports Default value to return if not
 *                                           explicitly defined
 * @return {?*}                              Block support value
 */


function getBlockSupport(nameOrType, feature, defaultSupports) {
  var blockType = 'string' === typeof nameOrType ? getBlockType(nameOrType) : nameOrType;
  return (0, _lodash.get)(blockType, ['supports', feature], defaultSupports);
}
/**
 * Returns true if the block defines support for a feature, or false otherwise.
 *
 * @param {(string|Object)} nameOrType      Block name or type object.
 * @param {string}          feature         Feature to test.
 * @param {boolean}         defaultSupports Whether feature is supported by
 *                                          default if not explicitly defined.
 *
 * @return {boolean} Whether block supports feature.
 */


function hasBlockSupport(nameOrType, feature, defaultSupports) {
  return !!getBlockSupport(nameOrType, feature, defaultSupports);
}
/**
 * Determines whether or not the given block is a reusable block. This is a
 * special block type that is used to point to a global block stored via the
 * API.
 *
 * @param {Object} blockOrType Block or Block Type to test.
 *
 * @return {boolean} Whether the given block is a reusable block.
 */


function isReusableBlock(blockOrType) {
  return blockOrType.name === 'core/block';
}

function isSharedBlock(blockOrType) {
  (0, _deprecated.default)('isSharedBlock', {
    alternative: 'isReusableBlock',
    version: '3.6',
    plugin: 'Gutenberg'
  });
  return isReusableBlock(blockOrType);
}
/**
 * Returns an array with the child blocks of a given block.
 *
 * @param {string} blockName Name of block (example: “latest-posts”).
 *
 * @return {Array} Array of child block names.
 */


var getChildBlockNames = function getChildBlockNames(blockName) {
  return (0, _data.select)('core/blocks').getChildBlockNames(blockName);
};
/**
 * Returns a boolean indicating if a block has child blocks or not.
 *
 * @param {string} blockName Name of block (example: “latest-posts”).
 *
 * @return {boolean} True if a block contains child blocks and false otherwise.
 */


exports.getChildBlockNames = getChildBlockNames;

var hasChildBlocks = function hasChildBlocks(blockName) {
  return (0, _data.select)('core/blocks').hasChildBlocks(blockName);
};
/**
 * Registers a new block style variation for the given block.
 *
 * @param {string} blockName      Name of block (example: “core/latest-posts”).
 * @param {Object} styleVariation Object containing `name` which is the class name applied to the block and `label` which identifies the variation to the user.
 */


exports.hasChildBlocks = hasChildBlocks;

var registerBlockStyle = function registerBlockStyle(blockName, styleVariation) {
  (0, _hooks.addFilter)('blocks.registerBlockType', "".concat(blockName, "/").concat(styleVariation.name), function (settings, name) {
    if (blockName !== name) {
      return settings;
    }

    return (0, _objectSpread2.default)({}, settings, {
      styles: (0, _toConsumableArray2.default)((0, _lodash.get)(settings, ['styles'], [])).concat([styleVariation])
    });
  });
};

exports.registerBlockStyle = registerBlockStyle;