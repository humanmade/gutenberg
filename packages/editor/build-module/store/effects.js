import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";

/**
 * External dependencies
 */
import { compact, last, has } from 'lodash';
/**
 * WordPress dependencies
 */

import { speak } from '@wordpress/a11y';
import { parse, getBlockType, switchToBlockType, doBlocksMatchTemplate, synchronizeBlocksWithTemplate } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */

import { setupEditorState, replaceBlocks, selectBlock, resetBlocks, setTemplateValidity, insertDefaultBlock } from './actions';
import { getBlock, getBlockRootClientId, getBlocks, getBlockCount, getPreviousBlockClientId, getSelectedBlock, getSelectedBlockCount, getTemplate, getTemplateLock, isValidTemplate } from './selectors';
import { fetchReusableBlocks, saveReusableBlocks, deleteReusableBlocks, convertBlockToReusable, convertBlockToStatic, receiveReusableBlocks } from './effects/reusable-blocks';
import { requestPostUpdate, requestPostUpdateSuccess, requestPostUpdateFailure, trashPost, trashPostFailure, refreshPost } from './effects/posts';
/**
 * Block validity is a function of blocks state (at the point of a
 * reset) and the template setting. As a compromise to its placement
 * across distinct parts of state, it is implemented here as a side-
 * effect of the block reset action.
 *
 * @param {Object} action RESET_BLOCKS action.
 * @param {Object} store  Store instance.
 *
 * @return {?Object} New validity set action if validity has changed.
 */

export function validateBlocksToTemplate(action, store) {
  var state = store.getState();
  var template = getTemplate(state);
  var templateLock = getTemplateLock(state); // Unlocked templates are considered always valid because they act
  // as default values only.

  var isBlocksValidToTemplate = !template || templateLock !== 'all' || doBlocksMatchTemplate(action.blocks, template); // Update if validity has changed.

  if (isBlocksValidToTemplate !== isValidTemplate(state)) {
    return setTemplateValidity(isBlocksValidToTemplate);
  }
}
/**
 * Effect handler which will return a block select action to select the block
 * occurring before the selected block in the previous state, unless it is the
 * same block or the action includes a falsey `selectPrevious` option flag.
 *
 * @param {Object} action Action which had initiated the effect handler.
 * @param {Object} store  Store instance.
 *
 * @return {?Object} Block select action to select previous, if applicable.
 */

export function selectPreviousBlock(action, store) {
  // if the action says previous block should not be selected don't do anything.
  if (!action.selectPrevious) {
    return;
  }

  var firstRemovedBlockClientId = action.clientIds[0];
  var state = store.getState();
  var currentSelectedBlock = getSelectedBlock(state); // recreate the state before the block was removed.

  var previousState = _objectSpread({}, state, {
    editor: {
      present: last(state.editor.past)
    }
  }); // rootClientId of the removed block.


  var rootClientId = getBlockRootClientId(previousState, firstRemovedBlockClientId); // Client ID of the block that was before the removed block or the
  // rootClientId if the removed block was first amongst its siblings.

  var blockClientIdToSelect = getPreviousBlockClientId(previousState, firstRemovedBlockClientId) || rootClientId; // Dispatch select block action if the currently selected block
  // is not already the block we want to be selected.

  if (blockClientIdToSelect !== currentSelectedBlock) {
    return selectBlock(blockClientIdToSelect, -1);
  }
}
/**
 * Effect handler which will return a default block insertion action if there
 * are no other blocks at the root of the editor. This is expected to be used
 * in actions which may result in no blocks remaining in the editor (removal,
 * replacement, etc).
 *
 * @param {Object} action Action which had initiated the effect handler.
 * @param {Object} store  Store instance.
 *
 * @return {?Object} Default block insert action, if no other blocks exist.
 */

export function ensureDefaultBlock(action, store) {
  if (!getBlockCount(store.getState())) {
    return insertDefaultBlock();
  }
}
export default {
  REQUEST_POST_UPDATE: function REQUEST_POST_UPDATE(action, store) {
    requestPostUpdate(action, store);
  },
  REQUEST_POST_UPDATE_SUCCESS: requestPostUpdateSuccess,
  REQUEST_POST_UPDATE_FAILURE: requestPostUpdateFailure,
  TRASH_POST: function TRASH_POST(action, store) {
    trashPost(action, store);
  },
  TRASH_POST_FAILURE: trashPostFailure,
  REFRESH_POST: function REFRESH_POST(action, store) {
    refreshPost(action, store);
  },
  MERGE_BLOCKS: function MERGE_BLOCKS(action, store) {
    var dispatch = store.dispatch;
    var state = store.getState();

    var _action$blocks = _slicedToArray(action.blocks, 2),
        firstBlockClientId = _action$blocks[0],
        secondBlockClientId = _action$blocks[1];

    var blockA = getBlock(state, firstBlockClientId);
    var blockB = getBlock(state, secondBlockClientId);
    var blockType = getBlockType(blockA.name); // Only focus the previous block if it's not mergeable

    if (!blockType.merge) {
      dispatch(selectBlock(blockA.clientId));
      return;
    } // We can only merge blocks with similar types
    // thus, we transform the block to merge first


    var blocksWithTheSameType = blockA.name === blockB.name ? [blockB] : switchToBlockType(blockB, blockA.name); // If the block types can not match, do nothing

    if (!blocksWithTheSameType || !blocksWithTheSameType.length) {
      return;
    } // Calling the merge to update the attributes and remove the block to be merged


    var updatedAttributes = blockType.merge(blockA.attributes, blocksWithTheSameType[0].attributes);
    dispatch(selectBlock(blockA.clientId, -1));
    dispatch(replaceBlocks([blockA.clientId, blockB.clientId], [_objectSpread({}, blockA, {
      attributes: _objectSpread({}, blockA.attributes, updatedAttributes)
    })].concat(_toConsumableArray(blocksWithTheSameType.slice(1)))));
  },
  SETUP_EDITOR: function SETUP_EDITOR(action, store) {
    var post = action.post,
        edits = action.edits;
    var state = store.getState(); // In order to ensure maximum of a single parse during setup, edits are
    // included as part of editor setup action. Assume edited content as
    // canonical if provided, falling back to post.

    var content;

    if (has(edits, ['content'])) {
      content = edits.content;
    } else {
      content = post.content.raw;
    }

    var blocks = parse(content); // Apply a template for new posts only, if exists.

    var isNewPost = post.status === 'auto-draft';
    var template = getTemplate(state);

    if (isNewPost && template) {
      blocks = synchronizeBlocksWithTemplate(blocks, template);
    }

    var setupAction = setupEditorState(post, blocks);
    return compact([setupAction, // TODO: This is temporary, necessary only so long as editor setup
    // is a separate action from block resetting.
    //
    // See: https://github.com/WordPress/gutenberg/pull/9403
    validateBlocksToTemplate(setupAction, store)]);
  },
  RESET_BLOCKS: [validateBlocksToTemplate],
  SYNCHRONIZE_TEMPLATE: function SYNCHRONIZE_TEMPLATE(action, _ref) {
    var getState = _ref.getState;
    var state = getState();
    var blocks = getBlocks(state);
    var template = getTemplate(state);
    var updatedBlockList = synchronizeBlocksWithTemplate(blocks, template);
    return resetBlocks(updatedBlockList);
  },
  FETCH_REUSABLE_BLOCKS: function FETCH_REUSABLE_BLOCKS(action, store) {
    fetchReusableBlocks(action, store);
  },
  SAVE_REUSABLE_BLOCK: function SAVE_REUSABLE_BLOCK(action, store) {
    saveReusableBlocks(action, store);
  },
  DELETE_REUSABLE_BLOCK: function DELETE_REUSABLE_BLOCK(action, store) {
    deleteReusableBlocks(action, store);
  },
  RECEIVE_REUSABLE_BLOCKS: receiveReusableBlocks,
  CONVERT_BLOCK_TO_STATIC: convertBlockToStatic,
  CONVERT_BLOCK_TO_REUSABLE: convertBlockToReusable,
  REMOVE_BLOCKS: [selectPreviousBlock, ensureDefaultBlock],
  REPLACE_BLOCKS: [ensureDefaultBlock],
  MULTI_SELECT: function MULTI_SELECT(action, _ref2) {
    var getState = _ref2.getState;
    var blockCount = getSelectedBlockCount(getState());
    speak(sprintf(__('%s blocks selected.'), blockCount), 'assertive');
  }
};
//# sourceMappingURL=effects.js.map