'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isHorizontalEdge = isHorizontalEdge;
exports.isVerticalEdge = isVerticalEdge;
exports.getRectangleFromRange = getRectangleFromRange;
exports.computeCaretRect = computeCaretRect;
exports.placeCaretAtHorizontalEdge = placeCaretAtHorizontalEdge;
exports.placeCaretAtVerticalEdge = placeCaretAtVerticalEdge;
exports.isTextField = isTextField;
exports.documentHasSelection = documentHasSelection;
exports.isEntirelySelected = isEntirelySelected;
exports.getScrollContainer = getScrollContainer;
exports.replace = replace;
exports.remove = remove;
exports.insertAfter = insertAfter;
exports.unwrap = unwrap;
exports.replaceTag = replaceTag;

var _lodash = require('lodash');

var _tinymce = require('tinymce');

var _tinymce2 = _interopRequireDefault(_tinymce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Browser dependencies
 */
/**
 * External dependencies
 */
var _window = window,
    getComputedStyle = _window.getComputedStyle,
    DOMRect = _window.DOMRect;
var _window$Node = window.Node,
    TEXT_NODE = _window$Node.TEXT_NODE,
    ELEMENT_NODE = _window$Node.ELEMENT_NODE;

/**
 * Check whether the caret is horizontally at the edge of the container.
 *
 * @param {Element} container      Focusable element.
 * @param {boolean} isReverse      Set to true to check left, false for right.
 * @param {boolean} collapseRanges Whether or not to collapse the selection range before the check.
 *
 * @return {boolean} True if at the horizontal edge, false if not.
 */

function isHorizontalEdge(container, isReverse) {
	var collapseRanges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	if ((0, _lodash.includes)(['INPUT', 'TEXTAREA'], container.tagName)) {
		if (container.selectionStart !== container.selectionEnd) {
			return false;
		}

		if (isReverse) {
			return container.selectionStart === 0;
		}

		return container.value.length === container.selectionStart;
	}

	if (!container.isContentEditable) {
		return true;
	}

	// If the container is empty, the caret is always at the edge.
	if (_tinymce2.default.DOM.isEmpty(container)) {
		return true;
	}

	var selection = window.getSelection();
	var range = selection.rangeCount ? selection.getRangeAt(0) : null;
	if (collapseRanges) {
		range = range.cloneRange();
		range.collapse(isReverse);
	}

	if (!range || !range.collapsed) {
		return false;
	}

	var position = isReverse ? 'start' : 'end';
	var order = isReverse ? 'first' : 'last';
	var offset = range[position + 'Offset'];

	var node = range.startContainer;

	if (isReverse && offset !== 0) {
		return false;
	}

	var maxOffset = node.nodeType === TEXT_NODE ? node.nodeValue.length : node.childNodes.length;

	if (!isReverse && offset !== maxOffset) {
		return false;
	}

	while (node !== container) {
		var parentNode = node.parentNode;

		if (parentNode[order + 'Child'] !== node) {
			return false;
		}

		node = parentNode;
	}

	return true;
}

/**
 * Check whether the caret is vertically at the edge of the container.
 *
 * @param {Element} container      Focusable element.
 * @param {boolean} isReverse      Set to true to check top, false for bottom.
 * @param {boolean} collapseRanges Whether or not to collapse the selection range before the check.
 *
 * @return {boolean} True if at the edge, false if not.
 */
function isVerticalEdge(container, isReverse) {
	var collapseRanges = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	if ((0, _lodash.includes)(['INPUT', 'TEXTAREA'], container.tagName)) {
		return isHorizontalEdge(container, isReverse);
	}

	if (!container.isContentEditable) {
		return true;
	}

	var selection = window.getSelection();
	var range = selection.rangeCount ? selection.getRangeAt(0) : null;
	if (collapseRanges && range && !range.collapsed) {
		var newRange = document.createRange();
		// Get the end point of the selection (see focusNode vs. anchorNode)
		newRange.setStart(selection.focusNode, selection.focusOffset);
		newRange.collapse(true);
		range = newRange;
	}

	if (!range || !range.collapsed) {
		return false;
	}

	var rangeRect = getRectangleFromRange(range);

	if (!rangeRect) {
		return false;
	}

	var buffer = rangeRect.height / 2;
	var editableRect = container.getBoundingClientRect();

	// Too low.
	if (isReverse && rangeRect.top - buffer > editableRect.top) {
		return false;
	}

	// Too high.
	if (!isReverse && rangeRect.bottom + buffer < editableRect.bottom) {
		return false;
	}

	return true;
}

/**
 * Get the rectangle of a given Range.
 *
 * @param {Range} range The range.
 *
 * @return {DOMRect} The rectangle.
 */
function getRectangleFromRange(range) {
	// For uncollapsed ranges, get the rectangle that bounds the contents of the
	// range; this a rectangle enclosing the union of the bounding rectangles
	// for all the elements in the range.
	if (!range.collapsed) {
		return range.getBoundingClientRect();
	}

	// If the collapsed range starts (and therefore ends) at an element node,
	// `getClientRects` will return undefined. To fix this we can get the
	// bounding rectangle of the element node to create a DOMRect based on that.
	if (range.startContainer.nodeType === ELEMENT_NODE) {
		var _range$startContainer = range.startContainer.getBoundingClientRect(),
		    x = _range$startContainer.x,
		    y = _range$startContainer.y,
		    height = _range$startContainer.height;

		// Create a new DOMRect with zero width.


		return new DOMRect(x, y, 0, height);
	}

	// For normal collapsed ranges (exception above), the bounding rectangle of
	// the range may be inaccurate in some browsers. There will only be one
	// rectangle since it is a collapsed range, so it is safe to pass this as
	// the union of them. This works consistently in all browsers.
	return (0, _lodash.first)(range.getClientRects());
}

/**
 * Get the rectangle for the selection in a container.
 *
 * @param {Element} container Editable container.
 *
 * @return {?DOMRect} The rectangle.
 */
function computeCaretRect(container) {
	if (!container.isContentEditable) {
		return;
	}

	var selection = window.getSelection();
	var range = selection.rangeCount ? selection.getRangeAt(0) : null;

	if (!range || !range.collapsed) {
		return;
	}

	return getRectangleFromRange(range);
}

/**
 * Places the caret at start or end of a given element.
 *
 * @param {Element} container Focusable element.
 * @param {boolean} isReverse True for end, false for start.
 */
function placeCaretAtHorizontalEdge(container, isReverse) {
	if (!container) {
		return;
	}

	if ((0, _lodash.includes)(['INPUT', 'TEXTAREA'], container.tagName)) {
		container.focus();
		if (isReverse) {
			container.selectionStart = container.value.length;
			container.selectionEnd = container.value.length;
		} else {
			container.selectionStart = 0;
			container.selectionEnd = 0;
		}
		return;
	}

	if (!container.isContentEditable) {
		container.focus();
		return;
	}

	var selection = window.getSelection();
	var range = document.createRange();

	range.selectNodeContents(container);
	range.collapse(!isReverse);

	selection.removeAllRanges();
	selection.addRange(range);

	container.focus();
}

/**
 * Polyfill.
 * Get a collapsed range for a given point.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/caretRangeFromPoint
 *
 * @param {Document} doc The document of the range.
 * @param {number}    x   Horizontal position within the current viewport.
 * @param {number}    y   Vertical position within the current viewport.
 *
 * @return {?Range} The best range for the given point.
 */
function caretRangeFromPoint(doc, x, y) {
	if (doc.caretRangeFromPoint) {
		return doc.caretRangeFromPoint(x, y);
	}

	if (!doc.caretPositionFromPoint) {
		return null;
	}

	var point = doc.caretPositionFromPoint(x, y);

	// If x or y are negative, outside viewport, or there is no text entry node.
	// https://developer.mozilla.org/en-US/docs/Web/API/Document/caretRangeFromPoint
	if (!point) {
		return null;
	}

	var range = doc.createRange();

	range.setStart(point.offsetNode, point.offset);
	range.collapse(true);

	return range;
}

/**
 * Get a collapsed range for a given point.
 * Gives the container a temporary high z-index (above any UI).
 * This is preferred over getting the UI nodes and set styles there.
 *
 * @param {Document} doc       The document of the range.
 * @param {number}    x         Horizontal position within the current viewport.
 * @param {number}    y         Vertical position within the current viewport.
 * @param {Element}  container Container in which the range is expected to be found.
 *
 * @return {?Range} The best range for the given point.
 */
function hiddenCaretRangeFromPoint(doc, x, y, container) {
	container.style.zIndex = '10000';

	var range = caretRangeFromPoint(doc, x, y);

	container.style.zIndex = null;

	return range;
}

/**
 * Places the caret at the top or bottom of a given element.
 *
 * @param {Element} container           Focusable element.
 * @param {boolean} isReverse           True for bottom, false for top.
 * @param {DOMRect} [rect]              The rectangle to position the caret with.
 * @param {boolean} [mayUseScroll=true] True to allow scrolling, false to disallow.
 */
function placeCaretAtVerticalEdge(container, isReverse, rect) {
	var mayUseScroll = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	if (!container) {
		return;
	}

	if (!rect || !container.isContentEditable) {
		placeCaretAtHorizontalEdge(container, isReverse);
		return;
	}

	// Offset by a buffer half the height of the caret rect. This is needed
	// because caretRangeFromPoint may default to the end of the selection if
	// offset is too close to the edge. It's unclear how to precisely calculate
	// this threshold; it may be the padded area of some combination of line
	// height, caret height, and font size. The buffer offset is effectively
	// equivalent to a point at half the height of a line of text.
	var buffer = rect.height / 2;
	var editableRect = container.getBoundingClientRect();
	var x = rect.left + rect.width / 2;
	var y = isReverse ? editableRect.bottom - buffer : editableRect.top + buffer;
	var selection = window.getSelection();

	var range = hiddenCaretRangeFromPoint(document, x, y, container);

	if (!range || !container.contains(range.startContainer)) {
		if (mayUseScroll && (!range || !range.startContainer || !range.startContainer.contains(container))) {
			// Might be out of view.
			// Easier than attempting to calculate manually.
			container.scrollIntoView(isReverse);
			placeCaretAtVerticalEdge(container, isReverse, rect, false);
			return;
		}

		placeCaretAtHorizontalEdge(container, isReverse);
		return;
	}

	// Check if the closest text node is actually further away.
	// If so, attempt to get the range again with the y position adjusted to get the right offset.
	if (range.startContainer.nodeType === TEXT_NODE) {
		var parentNode = range.startContainer.parentNode;
		var parentRect = parentNode.getBoundingClientRect();
		var side = isReverse ? 'bottom' : 'top';
		var padding = parseInt(getComputedStyle(parentNode).getPropertyValue('padding-' + side), 10) || 0;
		var actualY = isReverse ? parentRect.bottom - padding - buffer : parentRect.top + padding + buffer;

		if (y !== actualY) {
			range = hiddenCaretRangeFromPoint(document, x, actualY, container);
		}
	}

	selection.removeAllRanges();
	selection.addRange(range);
	container.focus();
	// Editable was already focussed, it goes back to old range...
	// This fixes it.
	selection.removeAllRanges();
	selection.addRange(range);
}

/**
 * Check whether the given element is a text field, where text field is defined
 * by the ability to select within the input, or that it is contenteditable.
 *
 * See: https://html.spec.whatwg.org/#textFieldSelection
 *
 * @param {HTMLElement} element The HTML element.
 *
 * @return {boolean} True if the element is an text field, false if not.
 */
function isTextField(element) {
	var nodeName = element.nodeName,
	    selectionStart = element.selectionStart,
	    contentEditable = element.contentEditable;


	return nodeName === 'INPUT' && selectionStart !== null || nodeName === 'TEXTAREA' || contentEditable === 'true';
}

/**
 * Check wether the current document has a selection.
 * This checks both for focus in an input field and general text selection.
 *
 * @return {boolean} True if there is selection, false if not.
 */
function documentHasSelection() {
	if (isTextField(document.activeElement)) {
		return true;
	}

	var selection = window.getSelection();
	var range = selection.rangeCount ? selection.getRangeAt(0) : null;

	return range && !range.collapsed;
}

/**
 * Check whether the contents of the element have been entirely selected.
 * Returns true if there is no possibility of selection.
 *
 * @param {Element} element The element to check.
 *
 * @return {boolean} True if entirely selected, false if not.
 */
function isEntirelySelected(element) {
	if ((0, _lodash.includes)(['INPUT', 'TEXTAREA'], element.nodeName)) {
		return element.selectionStart === 0 && element.value.length === element.selectionEnd;
	}

	if (!element.isContentEditable) {
		return true;
	}

	var selection = window.getSelection();
	var range = selection.rangeCount ? selection.getRangeAt(0) : null;

	if (!range) {
		return true;
	}

	var startContainer = range.startContainer,
	    endContainer = range.endContainer,
	    startOffset = range.startOffset,
	    endOffset = range.endOffset;


	return startContainer === element && endContainer === element && startOffset === 0 && endOffset === element.childNodes.length;
}

/**
 * Given a DOM node, finds the closest scrollable container node.
 *
 * @param {Element} node Node from which to start.
 *
 * @return {?Element} Scrollable container node, if found.
 */
function getScrollContainer(node) {
	if (!node) {
		return;
	}

	// Scrollable if scrollable height exceeds displayed...
	if (node.scrollHeight > node.clientHeight) {
		// ...except when overflow is defined to be hidden or visible
		var _window$getComputedSt = window.getComputedStyle(node),
		    overflowY = _window$getComputedSt.overflowY;

		if (/(auto|scroll)/.test(overflowY)) {
			return node;
		}
	}

	// Continue traversing
	return getScrollContainer(node.parentNode);
}

/**
 * Given two DOM nodes, replaces the former with the latter in the DOM.
 *
 * @param {Element} processedNode Node to be removed.
 * @param {Element} newNode       Node to be inserted in its place.
 * @return {void}
 */
function replace(processedNode, newNode) {
	insertAfter(newNode, processedNode.parentNode);
	remove(processedNode);
}

/**
 * Given a DOM node, removes it from the DOM.
 *
 * @param {Element} node Node to be removed.
 * @return {void}
 */
function remove(node) {
	node.parentNode.removeChild(node);
}

/**
 * Given two DOM nodes, inserts the former in the DOM as the next sibling of
 * the latter.
 *
 * @param {Element} newNode       Node to be inserted.
 * @param {Element} referenceNode Node after which to perform the insertion.
 * @return {void}
 */
function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Unwrap the given node. This means any child nodes are moved to the parent.
 *
 * @param {Node} node The node to unwrap.
 *
 * @return {void}
 */
function unwrap(node) {
	var parent = node.parentNode;

	while (node.firstChild) {
		parent.insertBefore(node.firstChild, node);
	}

	parent.removeChild(node);
}

/**
 * Replaces the given node with a new node with the given tag name.
 *
 * @param {Element}  node    The node to replace
 * @param {string}   tagName The new tag name.
 * @param {Document} doc     The document of the node.
 *
 * @return {Element} The new node.
 */
function replaceTag(node, tagName, doc) {
	var newNode = doc.createElement(tagName);

	while (node.firstChild) {
		newNode.appendChild(node.firstChild);
	}

	node.parentNode.replaceChild(newNode, node);

	return newNode;
}