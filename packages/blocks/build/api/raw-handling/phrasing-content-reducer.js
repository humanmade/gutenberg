"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _from = _interopRequireDefault(require("@babel/runtime/core-js/array/from"));

var _dom = require("@wordpress/dom");

var _utils = require("./utils");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function isBlockContent(node) {
  var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return schema.hasOwnProperty(node.nodeName.toLowerCase());
}

function _default(node, doc, schema) {
  if (node.nodeName === 'SPAN') {
    var _node$style = node.style,
        fontWeight = _node$style.fontWeight,
        fontStyle = _node$style.fontStyle;

    if (fontWeight === 'bold' || fontWeight === '700') {
      node = (0, _dom.replaceTag)(node, 'strong', doc);
    } else if (fontStyle === 'italic') {
      node = (0, _dom.replaceTag)(node, 'em', doc);
    }
  } else if (node.nodeName === 'B') {
    node = (0, _dom.replaceTag)(node, 'strong', doc);
  } else if (node.nodeName === 'I') {
    node = (0, _dom.replaceTag)(node, 'em', doc);
  } else if (node.nodeName === 'A') {
    if (node.target.toLowerCase() === '_blank') {
      node.rel = 'noreferrer noopener';
    } else {
      node.removeAttribute('target');
      node.removeAttribute('rel');
    }
  }

  if ((0, _utils.isPhrasingContent)(node) && node.hasChildNodes() && (0, _from.default)(node.childNodes).some(function (child) {
    return isBlockContent(child, schema);
  })) {
    (0, _dom.unwrap)(node);
  }
}