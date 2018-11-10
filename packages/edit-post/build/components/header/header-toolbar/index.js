"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _compose = require("@wordpress/compose");

var _data = require("@wordpress/data");

var _viewport = require("@wordpress/viewport");

var _nux = require("@wordpress/nux");

var _i18n = require("@wordpress/i18n");

var _editor = require("@wordpress/editor");

var _fullscreenModeClose = _interopRequireDefault(require("../fullscreen-mode-close"));

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function HeaderToolbar(_ref) {
  var hasFixedToolbar = _ref.hasFixedToolbar,
      isLargeViewport = _ref.isLargeViewport,
      mode = _ref.mode;
  var toolbarAriaLabel = hasFixedToolbar ? (0, _i18n.__)('Document and block tools') : (0, _i18n.__)('Document tools');
  return (0, _element.createElement)(_editor.NavigableToolbar, {
    className: "edit-post-header-toolbar",
    "aria-label": toolbarAriaLabel
  }, (0, _element.createElement)(_fullscreenModeClose.default, null), (0, _element.createElement)("div", null, (0, _element.createElement)(_editor.Inserter, {
    disabled: mode !== 'visual',
    position: "bottom right"
  }), (0, _element.createElement)(_nux.DotTip, {
    tipId: "core/editor.inserter"
  }, (0, _i18n.__)('Welcome to the wonderful world of blocks! Click the “+” (“Add block”) button to add a new block. There are blocks available for all kinds of content: you can insert text, headings, images, lists, and lots more!'))), (0, _element.createElement)(_editor.EditorHistoryUndo, null), (0, _element.createElement)(_editor.EditorHistoryRedo, null), (0, _element.createElement)(_editor.TableOfContents, null), (0, _element.createElement)(_editor.BlockNavigationDropdown, null), hasFixedToolbar && isLargeViewport && (0, _element.createElement)("div", {
    className: "edit-post-header-toolbar__block-toolbar"
  }, (0, _element.createElement)(_editor.BlockToolbar, null)));
}

var _default = (0, _compose.compose)([(0, _data.withSelect)(function (select) {
  return {
    hasFixedToolbar: select('core/edit-post').isFeatureActive('fixedToolbar'),
    mode: select('core/edit-post').getEditorMode()
  };
}), (0, _viewport.withViewportMatch)({
  isLargeViewport: 'medium'
})])(HeaderToolbar);

exports.default = _default;
//# sourceMappingURL=index.js.map