import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { noop, every } from 'lodash';
/**
 * WordPress dependencies
 */

import { Fragment } from '@wordpress/element';
import { MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { hasBlockSupport, isReusableBlock } from '@wordpress/blocks';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
export function ReusableBlockConvertButton(_ref) {
  var isVisible = _ref.isVisible,
      isStaticBlock = _ref.isStaticBlock,
      onConvertToStatic = _ref.onConvertToStatic,
      onConvertToReusable = _ref.onConvertToReusable;

  if (!isVisible) {
    return null;
  }

  return createElement(Fragment, null, isStaticBlock && createElement(MenuItem, {
    className: "editor-block-settings-menu__control",
    icon: "controls-repeat",
    onClick: onConvertToReusable
  }, __('Add to Reusable Blocks')), !isStaticBlock && createElement(MenuItem, {
    className: "editor-block-settings-menu__control",
    icon: "controls-repeat",
    onClick: onConvertToStatic
  }, __('Convert to Regular Block')));
}
export default compose([withSelect(function (select, _ref2) {
  var clientIds = _ref2.clientIds;

  var _select = select('core/editor'),
      getBlocksByClientId = _select.getBlocksByClientId,
      canInsertBlockType = _select.canInsertBlockType,
      getReusableBlock = _select.__experimentalGetReusableBlock;

  var blocks = getBlocksByClientId(clientIds);
  var isVisible = // Hide 'Add to Reusable Blocks' when Reusable Blocks are disabled, i.e. when
  // core/block is not in the allowed_block_types filter.
  canInsertBlockType('core/block') && every(blocks, function (block) {
    return (// Guard against the case where a regular block has *just* been converted to a
      // reusable block and doesn't yet exist in the editor store.
      !!block && // Only show the option to covert to reusable blocks on valid blocks.
      block.isValid && // Make sure the block supports being converted into a reusable block (by default that is the case).
      hasBlockSupport(block.name, 'reusable', true)
    );
  });
  return {
    isVisible: isVisible,
    isStaticBlock: isVisible && (blocks.length !== 1 || !isReusableBlock(blocks[0]) || !getReusableBlock(blocks[0].attributes.ref))
  };
}), withDispatch(function (dispatch, _ref3) {
  var clientIds = _ref3.clientIds,
      _ref3$onToggle = _ref3.onToggle,
      onToggle = _ref3$onToggle === void 0 ? noop : _ref3$onToggle;

  var _dispatch = dispatch('core/editor'),
      convertBlockToReusable = _dispatch.__experimentalConvertBlockToReusable,
      convertBlockToStatic = _dispatch.__experimentalConvertBlockToStatic;

  return {
    onConvertToStatic: function onConvertToStatic() {
      if (clientIds.length !== 1) {
        return;
      }

      convertBlockToStatic(clientIds[0]);
      onToggle();
    },
    onConvertToReusable: function onConvertToReusable() {
      convertBlockToReusable(clientIds);
      onToggle();
    }
  };
})])(ReusableBlockConvertButton);
//# sourceMappingURL=reusable-block-convert-button.js.map