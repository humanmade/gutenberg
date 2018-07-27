"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNamedNodeMapAsObject = getNamedNodeMapAsObject;
exports.fromDOM = fromDOM;
exports.toHTML = toHTML;
exports.matcher = matcher;
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

require("core-js/modules/es6.function.name");

var children = _interopRequireWildcard(require("./children"));

/**
 * Internal dependencies
 */

/**
 * Browser dependencies
 */
var _window$Node = window.Node,
    TEXT_NODE = _window$Node.TEXT_NODE,
    ELEMENT_NODE = _window$Node.ELEMENT_NODE;
/**
 * A representation of a single node within a block's rich text value. If
 * representing a text node, the value is simply a string of the node value.
 * As representing an element node, it is an object of:
 *
 * 1. `type` (string): Tag name.
 * 2. `props` (object): Attributes and children array of WPBlockNode.
 *
 * @typedef {string|Object} WPBlockNode
 */

/**
 * Given an object implementing the NamedNodeMap interface, returns a plain
 * object equivalent value of name, value key-value pairs.
 *
 * @see https://dom.spec.whatwg.org/#interface-namednodemap
 *
 * @param {NamedNodeMap} nodeMap NamedNodeMap to convert to object.
 *
 * @return {Object} Object equivalent value of NamedNodeMap.
 */

function getNamedNodeMapAsObject(nodeMap) {
  var result = {};

  for (var i = 0; i < nodeMap.length; i++) {
    var _nodeMap$i = nodeMap[i],
        name = _nodeMap$i.name,
        value = _nodeMap$i.value;
    result[name] = value;
  }

  return result;
}
/**
 * Given a DOM Element or Text node, returns an equivalent block node. Throws
 * if passed any node type other than element or text.
 *
 * @throws {TypeError} If non-element/text node is passed.
 *
 * @param {Node} domNode DOM node to convert.
 *
 * @return {WPBlockNode} Block node equivalent to DOM node.
 */


function fromDOM(domNode) {
  if (domNode.nodeType === TEXT_NODE) {
    return domNode.nodeValue;
  }

  if (domNode.nodeType !== ELEMENT_NODE) {
    throw new TypeError('A block node can only be created from a node of type text or ' + 'element.');
  }

  return {
    type: domNode.nodeName.toLowerCase(),
    props: (0, _objectSpread2.default)({}, getNamedNodeMapAsObject(domNode.attributes), {
      children: children.fromDOM(domNode.childNodes)
    })
  };
}
/**
 * Given a block node, returns its HTML string representation.
 *
 * @param {WPBlockNode} node Block node to convert to string.
 *
 * @return {string} String HTML representation of block node.
 */


function toHTML(node) {
  return children.toHTML([node]);
}
/**
 * Given a selector, returns an hpq matcher generating a WPBlockNode value
 * matching the selector result.
 *
 * @param {string} selector DOM selector.
 *
 * @return {Function} hpq matcher.
 */


function matcher(selector) {
  return function (domNode) {
    var match = domNode;

    if (selector) {
      match = domNode.querySelector(selector);
    }

    try {
      return fromDOM(match);
    } catch (error) {
      return null;
    }
  };
}

var _default = {
  fromDOM: fromDOM,
  toHTML: toHTML,
  matcher: matcher
};
exports.default = _default;