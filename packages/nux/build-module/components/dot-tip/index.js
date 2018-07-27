import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { compose, withSafeTimeout } from '@wordpress/compose';
import { Popover, Button, IconButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
export function DotTip(_ref) {
  var children = _ref.children,
      isVisible = _ref.isVisible,
      hasNextTip = _ref.hasNextTip,
      onDismiss = _ref.onDismiss,
      onDisable = _ref.onDisable;

  if (!isVisible) {
    return null;
  }

  return createElement(Popover, {
    className: "nux-dot-tip",
    position: "middle right",
    noArrow: true,
    focusOnMount: "container",
    role: "dialog",
    "aria-label": __('Gutenberg tips'),
    onClick: function onClick(event) {
      return event.stopPropagation();
    }
  }, createElement("p", null, children), createElement("p", null, createElement(Button, {
    isLink: true,
    onClick: onDismiss
  }, hasNextTip ? __('See next tip') : __('Got it'))), createElement(IconButton, {
    className: "nux-dot-tip__disable",
    icon: "no-alt",
    label: __('Disable tips'),
    onClick: onDisable
  }));
}
export default compose(withSafeTimeout, withSelect(function (select, _ref2) {
  var id = _ref2.id;

  var _select = select('core/nux'),
      isTipVisible = _select.isTipVisible,
      getAssociatedGuide = _select.getAssociatedGuide;

  var associatedGuide = getAssociatedGuide(id);
  return {
    isVisible: isTipVisible(id),
    hasNextTip: !!(associatedGuide && associatedGuide.nextTipId)
  };
}), withDispatch(function (dispatch, _ref3) {
  var id = _ref3.id;

  var _dispatch = dispatch('core/nux'),
      dismissTip = _dispatch.dismissTip,
      disableTips = _dispatch.disableTips;

  return {
    onDismiss: function onDismiss() {
      dismissTip(id);
    },
    onDisable: function onDisable() {
      disableTips();
    }
  };
}))(DotTip);