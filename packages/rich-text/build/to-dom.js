"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDom = toDom;
exports.apply = apply;
exports.applyValue = applyValue;
exports.applySelection = applySelection;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _toTree = require("./to-tree");

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
 * Creates a path as an array of indices from the given root node to the given
 * node.
 *
 * @param {Node}        node     Node to find the path of.
 * @param {HTMLElement} rootNode Root node to find the path from.
 * @param {Array}       path     Initial path to build on.
 *
 * @return {Array} The path from the root node to the node.
 */

function createPathToNode(node, rootNode, path) {
  var parentNode = node.parentNode;
  var i = 0;

  while (node = node.previousSibling) {
    i++;
  }

  path = [i].concat((0, _toConsumableArray2.default)(path));

  if (parentNode !== rootNode) {
    path = createPathToNode(parentNode, rootNode, path);
  }

  return path;
}
/**
 * Gets a node given a path (array of indices) from the given node.
 *
 * @param {HTMLElement} node Root node to find the wanted node in.
 * @param {Array}       path Path (indices) to the wanted node.
 *
 * @return {Object} Object with the found node and the remaining offset (if any).
 */


function getNodeByPath(node, path) {
  path = (0, _toConsumableArray2.default)(path);

  while (node && path.length > 1) {
    node = node.childNodes[path.shift()];
  }

  return {
    node: node,
    offset: path[0]
  };
}

function createEmpty() {
  var _document$implementat = document.implementation.createHTMLDocument(''),
      body = _document$implementat.body;

  return body;
}

function append(element, child) {
  if (typeof child === 'string') {
    child = element.ownerDocument.createTextNode(child);
  }

  var _child = child,
      type = _child.type,
      attributes = _child.attributes;

  if (type) {
    child = element.ownerDocument.createElement(type);

    for (var key in attributes) {
      child.setAttribute(key, attributes[key]);
    }
  }

  return element.appendChild(child);
}

function appendText(node, text) {
  node.appendData(text);
}

function getLastChild(_ref) {
  var lastChild = _ref.lastChild;
  return lastChild;
}

function getParent(_ref2) {
  var parentNode = _ref2.parentNode;
  return parentNode;
}

function isText(_ref3) {
  var nodeType = _ref3.nodeType;
  return nodeType === TEXT_NODE;
}

function getText(_ref4) {
  var nodeValue = _ref4.nodeValue;
  return nodeValue;
}

function remove(node) {
  return node.parentNode.removeChild(node);
}

function padEmptyLines(_ref5) {
  var element = _ref5.element,
      createLinePadding = _ref5.createLinePadding,
      multilineWrapperTags = _ref5.multilineWrapperTags;
  var length = element.childNodes.length;
  var doc = element.ownerDocument;

  for (var index = 0; index < length; index++) {
    var child = element.childNodes[index];

    if (child.nodeType === TEXT_NODE) {
      if (length === 1 && !child.nodeValue) {
        // Pad if the only child is an empty text node.
        element.appendChild(createLinePadding(doc));
      }
    } else {
      if (multilineWrapperTags && !child.previousSibling && multilineWrapperTags.indexOf(child.nodeName.toLowerCase()) !== -1) {
        // Pad the line if there is no content before a nested wrapper.
        element.insertBefore(createLinePadding(doc), child);
      }

      padEmptyLines({
        element: child,
        createLinePadding: createLinePadding,
        multilineWrapperTags: multilineWrapperTags
      });
    }
  }
}

function prepareFormats() {
  var prepareEditableTree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var value = arguments.length > 1 ? arguments[1] : undefined;
  return prepareEditableTree.reduce(function (accumlator, fn) {
    return fn(accumlator, value.text);
  }, value.formats);
}

function toDom(_ref6) {
  var value = _ref6.value,
      multilineTag = _ref6.multilineTag,
      multilineWrapperTags = _ref6.multilineWrapperTags,
      createLinePadding = _ref6.createLinePadding,
      prepareEditableTree = _ref6.prepareEditableTree;
  var startPath = [];
  var endPath = [];
  var tree = (0, _toTree.toTree)({
    value: (0, _objectSpread2.default)({}, value, {
      formats: prepareFormats(prepareEditableTree, value)
    }),
    multilineTag: multilineTag,
    multilineWrapperTags: multilineWrapperTags,
    createEmpty: createEmpty,
    append: append,
    getLastChild: getLastChild,
    getParent: getParent,
    isText: isText,
    getText: getText,
    remove: remove,
    appendText: appendText,
    onStartIndex: function onStartIndex(body, pointer) {
      startPath = createPathToNode(pointer, body, [pointer.nodeValue.length]);
    },
    onEndIndex: function onEndIndex(body, pointer) {
      endPath = createPathToNode(pointer, body, [pointer.nodeValue.length]);
    },
    isEditableTree: true
  });

  if (createLinePadding) {
    padEmptyLines({
      element: tree,
      createLinePadding: createLinePadding,
      multilineWrapperTags: multilineWrapperTags
    });
  }

  return {
    body: tree,
    selection: {
      startPath: startPath,
      endPath: endPath
    }
  };
}
/**
 * Create an `Element` tree from a Rich Text value and applies the difference to
 * the `Element` tree contained by `current`. If a `multilineTag` is provided,
 * text separated by two new lines will be wrapped in an `Element` of that type.
 *
 * @param {Object}      value        Value to apply.
 * @param {HTMLElement} current      The live root node to apply the element
 *                                   tree to.
 * @param {string}      multilineTag Multiline tag.
 */


function apply(_ref7) {
  var value = _ref7.value,
      current = _ref7.current,
      multilineTag = _ref7.multilineTag,
      multilineWrapperTags = _ref7.multilineWrapperTags,
      createLinePadding = _ref7.createLinePadding,
      prepareEditableTree = _ref7.prepareEditableTree;

  // Construct a new element tree in memory.
  var _toDom = toDom({
    value: value,
    multilineTag: multilineTag,
    multilineWrapperTags: multilineWrapperTags,
    createLinePadding: createLinePadding,
    prepareEditableTree: prepareEditableTree
  }),
      body = _toDom.body,
      selection = _toDom.selection;

  applyValue(body, current);

  if (value.start !== undefined) {
    applySelection(selection, current);
  }
}

function applyValue(future, current) {
  var i = 0;

  while (future.firstChild) {
    var currentChild = current.childNodes[i];
    var futureNodeType = future.firstChild.nodeType;

    if (!currentChild) {
      current.appendChild(future.firstChild);
    } else if (futureNodeType !== currentChild.nodeType || futureNodeType !== TEXT_NODE || future.firstChild.nodeValue !== currentChild.nodeValue) {
      current.replaceChild(future.firstChild, currentChild);
    } else {
      future.removeChild(future.firstChild);
    }

    i++;
  }

  while (current.childNodes[i]) {
    current.removeChild(current.childNodes[i]);
  }
}

function applySelection(selection, current) {
  var _getNodeByPath = getNodeByPath(current, selection.startPath),
      startContainer = _getNodeByPath.node,
      startOffset = _getNodeByPath.offset;

  var _getNodeByPath2 = getNodeByPath(current, selection.endPath),
      endContainer = _getNodeByPath2.node,
      endOffset = _getNodeByPath2.offset;

  var windowSelection = window.getSelection();
  var range = current.ownerDocument.createRange();
  var collapsed = startContainer === endContainer && startOffset === endOffset;

  if (collapsed && startOffset === 0 && startContainer.previousSibling && startContainer.previousSibling.nodeType === ELEMENT_NODE && startContainer.previousSibling.nodeName !== 'BR') {
    startContainer.insertData(0, "\uFEFF");
    range.setStart(startContainer, 1);
    range.setEnd(endContainer, 1);
  } else if (collapsed && startOffset === 0 && startContainer === TEXT_NODE && startContainer.nodeValue.length === 0) {
    startContainer.insertData(0, "\uFEFF");
    range.setStart(startContainer, 1);
    range.setEnd(endContainer, 1);
  } else {
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
  }

  windowSelection.removeAllRanges();
  windowSelection.addRange(range);
}
//# sourceMappingURL=to-dom.js.map