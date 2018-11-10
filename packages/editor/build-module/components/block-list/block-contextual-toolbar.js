import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */

import NavigableToolbar from '../navigable-toolbar';
import { BlockToolbar } from '../';

function BlockContextualToolbar(_ref) {
  var focusOnMount = _ref.focusOnMount;
  return createElement(NavigableToolbar, {
    focusOnMount: focusOnMount,
    className: "editor-block-contextual-toolbar",
    "aria-label": __('Block Toolbar')
  }, createElement(BlockToolbar, null));
}

export default BlockContextualToolbar;
//# sourceMappingURL=block-contextual-toolbar.js.map