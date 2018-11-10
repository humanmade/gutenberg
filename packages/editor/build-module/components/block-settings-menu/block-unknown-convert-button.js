/**
 * WordPress dependencies
 */
import { getFreeformContentHandlerName, rawHandler, serialize } from '@wordpress/blocks';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */

import BlockConvertButton from './block-convert-button';
export default compose(withSelect(function (select, _ref) {
  var clientId = _ref.clientId;
  var block = select('core/editor').getBlock(clientId);
  return {
    block: block,
    shouldRender: block && block.name === getFreeformContentHandlerName()
  };
}), withDispatch(function (dispatch, _ref2) {
  var block = _ref2.block;
  return {
    onClick: function onClick() {
      return dispatch('core/editor').replaceBlocks(block.clientId, rawHandler({
        HTML: serialize(block)
      }));
    }
  };
}))(BlockConvertButton);
//# sourceMappingURL=block-unknown-convert-button.js.map