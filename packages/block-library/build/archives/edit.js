"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ArchivesEdit;

var _element = require("@wordpress/element");

var _components = require("@wordpress/components");

var _i18n = require("@wordpress/i18n");

var _editor = require("@wordpress/editor");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function ArchivesEdit(_ref) {
  var attributes = _ref.attributes,
      setAttributes = _ref.setAttributes;
  var align = attributes.align,
      showPostCounts = attributes.showPostCounts,
      displayAsDropdown = attributes.displayAsDropdown;
  return (0, _element.createElement)(_element.Fragment, null, (0, _element.createElement)(_editor.InspectorControls, null, (0, _element.createElement)(_components.PanelBody, {
    title: (0, _i18n.__)('Archives Settings')
  }, (0, _element.createElement)(_components.ToggleControl, {
    label: (0, _i18n.__)('Display as Dropdown'),
    checked: displayAsDropdown,
    onChange: function onChange() {
      return setAttributes({
        displayAsDropdown: !displayAsDropdown
      });
    }
  }), (0, _element.createElement)(_components.ToggleControl, {
    label: (0, _i18n.__)('Show Post Counts'),
    checked: showPostCounts,
    onChange: function onChange() {
      return setAttributes({
        showPostCounts: !showPostCounts
      });
    }
  }))), (0, _element.createElement)(_editor.BlockControls, null, (0, _element.createElement)(_editor.BlockAlignmentToolbar, {
    value: align,
    onChange: function onChange(nextAlign) {
      setAttributes({
        align: nextAlign
      });
    },
    controls: ['left', 'center', 'right']
  })), (0, _element.createElement)(_components.Disabled, null, (0, _element.createElement)(_editor.ServerSideRender, {
    block: "core/archives",
    attributes: attributes
  })));
}
//# sourceMappingURL=edit.js.map