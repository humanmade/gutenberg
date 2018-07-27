"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DotTip = DotTip;
exports.default = void 0;

var _element = require("@wordpress/element");

var _compose = require("@wordpress/compose");

var _components = require("@wordpress/components");

var _i18n = require("@wordpress/i18n");

var _data = require("@wordpress/data");

/**
 * WordPress dependencies
 */
function DotTip(_ref) {
  var children = _ref.children,
      isVisible = _ref.isVisible,
      hasNextTip = _ref.hasNextTip,
      onDismiss = _ref.onDismiss,
      onDisable = _ref.onDisable;

  if (!isVisible) {
    return null;
  }

  return (0, _element.createElement)(_components.Popover, {
    className: "nux-dot-tip",
    position: "middle right",
    noArrow: true,
    focusOnMount: "container",
    role: "dialog",
    "aria-label": (0, _i18n.__)('Gutenberg tips'),
    onClick: function onClick(event) {
      return event.stopPropagation();
    }
  }, (0, _element.createElement)("p", null, children), (0, _element.createElement)("p", null, (0, _element.createElement)(_components.Button, {
    isLink: true,
    onClick: onDismiss
  }, hasNextTip ? (0, _i18n.__)('See next tip') : (0, _i18n.__)('Got it'))), (0, _element.createElement)(_components.IconButton, {
    className: "nux-dot-tip__disable",
    icon: "no-alt",
    label: (0, _i18n.__)('Disable tips'),
    onClick: onDisable
  }));
}

var _default = (0, _compose.compose)(_compose.withSafeTimeout, (0, _data.withSelect)(function (select, _ref2) {
  var id = _ref2.id;

  var _select = select('core/nux'),
      isTipVisible = _select.isTipVisible,
      getAssociatedGuide = _select.getAssociatedGuide;

  var associatedGuide = getAssociatedGuide(id);
  return {
    isVisible: isTipVisible(id),
    hasNextTip: !!(associatedGuide && associatedGuide.nextTipId)
  };
}), (0, _data.withDispatch)(function (dispatch, _ref3) {
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

exports.default = _default;