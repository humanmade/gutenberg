"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _compose = require("@wordpress/compose");

var _data = require("@wordpress/data");

var _blocks = require("@wordpress/blocks");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
function BlockActions(_ref) {
  var onDuplicate = _ref.onDuplicate,
      onRemove = _ref.onRemove,
      onInsertBefore = _ref.onInsertBefore,
      onInsertAfter = _ref.onInsertAfter,
      isLocked = _ref.isLocked,
      canDuplicate = _ref.canDuplicate,
      children = _ref.children;
  return children({
    onDuplicate: onDuplicate,
    onRemove: onRemove,
    onInsertAfter: onInsertAfter,
    onInsertBefore: onInsertBefore,
    isLocked: isLocked,
    canDuplicate: canDuplicate
  });
}

var _default = (0, _compose.compose)([(0, _data.withSelect)(function (select, props) {
  var _select = select('core/editor'),
      getBlocksByClientId = _select.getBlocksByClientId,
      getBlockIndex = _select.getBlockIndex,
      getTemplateLock = _select.getTemplateLock,
      getBlockRootClientId = _select.getBlockRootClientId;

  var blocks = getBlocksByClientId(props.clientIds);
  var canDuplicate = (0, _lodash.every)(blocks, function (block) {
    return !!block && (0, _blocks.hasBlockSupport)(block.name, 'multiple', true);
  });
  var rootClientId = getBlockRootClientId(props.clientIds[0]);
  return {
    firstSelectedIndex: getBlockIndex((0, _lodash.first)((0, _lodash.castArray)(props.clientIds)), rootClientId),
    lastSelectedIndex: getBlockIndex((0, _lodash.last)((0, _lodash.castArray)(props.clientIds)), rootClientId),
    isLocked: !!getTemplateLock(rootClientId),
    blocks: blocks,
    canDuplicate: canDuplicate,
    rootClientId: rootClientId,
    extraProps: props
  };
}), (0, _data.withDispatch)(function (dispatch, props) {
  var clientIds = props.clientIds,
      rootClientId = props.rootClientId,
      blocks = props.blocks,
      firstSelectedIndex = props.firstSelectedIndex,
      lastSelectedIndex = props.lastSelectedIndex,
      isLocked = props.isLocked,
      canDuplicate = props.canDuplicate;

  var _dispatch = dispatch('core/editor'),
      insertBlocks = _dispatch.insertBlocks,
      multiSelect = _dispatch.multiSelect,
      removeBlocks = _dispatch.removeBlocks,
      insertDefaultBlock = _dispatch.insertDefaultBlock;

  return {
    onDuplicate: function onDuplicate() {
      if (isLocked || !canDuplicate) {
        return;
      }

      var clonedBlocks = blocks.map(function (block) {
        return (0, _blocks.cloneBlock)(block);
      });
      insertBlocks(clonedBlocks, lastSelectedIndex + 1, rootClientId);

      if (clonedBlocks.length > 1) {
        multiSelect((0, _lodash.first)(clonedBlocks).clientId, (0, _lodash.last)(clonedBlocks).clientId);
      }
    },
    onRemove: function onRemove() {
      if (!isLocked) {
        removeBlocks(clientIds);
      }
    },
    onInsertBefore: function onInsertBefore() {
      if (!isLocked) {
        insertDefaultBlock({}, rootClientId, firstSelectedIndex);
      }
    },
    onInsertAfter: function onInsertAfter() {
      if (!isLocked) {
        insertDefaultBlock({}, rootClientId, lastSelectedIndex + 1);
      }
    }
  };
})])(BlockActions);

exports.default = _default;
//# sourceMappingURL=index.js.map