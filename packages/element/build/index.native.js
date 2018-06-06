'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToString = exports.Component = exports.createElement = undefined;

var _react = require('react');

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a new element of given type. Type can be either a string tag name or
 * another function which itself returns an element.
 *
 * @param {?(string|Function)} type     Tag name or element creator
 * @param {Object}             props    Element properties, either attribute
 *                                       set to apply to DOM node or values to
 *                                       pass through to element creator
 * @param {...WPElement}       children Descendant elements
 *
 * @return {WPElement} Element.
 */
/**
 * External dependencies
 */
exports.createElement = _react.createElement;

/**
 * A base class to create WordPress Components (Refs, state and lifecycle hooks)
 */


/**
 * Internal dependencies
 */

exports.Component = _react.Component;

/**
 * Renders a given element into a string.
 *
 * @param {WPElement} element Element to render
 *
 * @return {string} HTML.
 */

exports.renderToString = _serialize2.default;