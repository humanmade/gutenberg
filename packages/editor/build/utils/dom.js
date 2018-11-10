"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBlockDOMNode = getBlockDOMNode;
exports.getBlockFocusableWrapper = getBlockFocusableWrapper;
exports.isBlockFocusStop = isBlockFocusStop;
exports.isInSameBlock = isInSameBlock;
exports.isInsideRootBlock = isInsideRootBlock;
exports.hasInnerBlocksContext = hasInnerBlocksContext;

/**
 * Given a block client ID, returns the corresponding DOM node for the block,
 * if exists. As much as possible, this helper should be avoided, and used only
 * in cases where isolated behaviors need remote access to a block node.
 *
 * @param {string} clientId Block client ID.
 *
 * @return {Element} Block DOM node.
 */
function getBlockDOMNode(clientId) {
  return document.querySelector('[data-block="' + clientId + '"]');
}
/**
 * Given a block client ID, returns the corresponding DOM node for the block
 * focusable wrapper, if exists. As much as possible, this helper should be
 * avoided, and used only in cases where isolated behaviors need remote access
 * to a block node.
 *
 * @param {string} clientId Block client ID.
 *
 * @return {Element} Block DOM node.
 */


function getBlockFocusableWrapper(clientId) {
  return getBlockDOMNode(clientId).closest('.editor-block-list__block');
}
/**
 * Returns true if the given HTMLElement is a block focus stop. Blocks without
 * their own text fields rely on the focus stop to be keyboard navigable.
 *
 * @param {HTMLElement} element Element to test.
 *
 * @return {boolean} Whether element is a block focus stop.
 */


function isBlockFocusStop(element) {
  return element.classList.contains('editor-block-list__block');
}
/**
 * Returns true if two elements are contained within the same block.
 *
 * @param {HTMLElement} a First element.
 * @param {HTMLElement} b Second element.
 *
 * @return {boolean} Whether elements are in the same block.
 */


function isInSameBlock(a, b) {
  return a.closest('[data-block]') === b.closest('[data-block]');
}
/**
 * Returns true if an elements is considered part of the block and not its children.
 *
 * @param {HTMLElement} blockElement Block container element.
 * @param {HTMLElement} element      Element.
 *
 * @return {boolean} Whether element is in the block Element but not its children.
 */


function isInsideRootBlock(blockElement, element) {
  var innerBlocksContainer = blockElement.querySelector('.editor-block-list__layout');
  return blockElement.contains(element) && (!innerBlocksContainer || !innerBlocksContainer.contains(element));
}
/**
 * Returns true if the given HTMLElement contains inner blocks (an InnerBlocks
 * element).
 *
 * @param {HTMLElement} element Element to test.
 *
 * @return {boolean} Whether element contains inner blocks.
 */


function hasInnerBlocksContext(element) {
  return !!element.querySelector('.editor-block-list__layout');
}
//# sourceMappingURL=dom.js.map