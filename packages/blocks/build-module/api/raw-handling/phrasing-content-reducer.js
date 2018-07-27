import _Array$from from "@babel/runtime/core-js/array/from";

/**
 * WordPress dependencies
 */
import { unwrap, replaceTag } from '@wordpress/dom';
/**
 * Internal dependencies
 */

import { isPhrasingContent } from './utils';

function isBlockContent(node) {
  var schema = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return schema.hasOwnProperty(node.nodeName.toLowerCase());
}

export default function (node, doc, schema) {
  if (node.nodeName === 'SPAN') {
    var _node$style = node.style,
        fontWeight = _node$style.fontWeight,
        fontStyle = _node$style.fontStyle;

    if (fontWeight === 'bold' || fontWeight === '700') {
      node = replaceTag(node, 'strong', doc);
    } else if (fontStyle === 'italic') {
      node = replaceTag(node, 'em', doc);
    }
  } else if (node.nodeName === 'B') {
    node = replaceTag(node, 'strong', doc);
  } else if (node.nodeName === 'I') {
    node = replaceTag(node, 'em', doc);
  } else if (node.nodeName === 'A') {
    if (node.target.toLowerCase() === '_blank') {
      node.rel = 'noreferrer noopener';
    } else {
      node.removeAttribute('target');
      node.removeAttribute('rel');
    }
  }

  if (isPhrasingContent(node) && node.hasChildNodes() && _Array$from(node.childNodes).some(function (child) {
    return isBlockContent(child, schema);
  })) {
    unwrap(node);
  }
}