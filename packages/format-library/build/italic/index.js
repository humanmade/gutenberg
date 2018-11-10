"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.italic = void 0;

var _element = require("@wordpress/element");

var _i18n = require("@wordpress/i18n");

var _richText = require("@wordpress/rich-text");

var _editor = require("@wordpress/editor");

/**
 * WordPress dependencies
 */
var name = 'core/italic';
var italic = {
  name: name,
  title: (0, _i18n.__)('Italic'),
  tagName: 'em',
  className: null,
  edit: function edit(_ref) {
    var isActive = _ref.isActive,
        value = _ref.value,
        onChange = _ref.onChange;

    var onToggle = function onToggle() {
      return onChange((0, _richText.toggleFormat)(value, {
        type: name
      }));
    };

    return (0, _element.createElement)(_element.Fragment, null, (0, _element.createElement)(_editor.RichTextShortcut, {
      type: "primary",
      character: "i",
      onUse: onToggle
    }), (0, _element.createElement)(_editor.RichTextToolbarButton, {
      name: "italic",
      icon: "editor-italic",
      title: (0, _i18n.__)('Italic'),
      onClick: onToggle,
      isActive: isActive,
      shortcutType: "primary",
      shortcutCharacter: "i"
    }));
  }
};
exports.italic = italic;
//# sourceMappingURL=index.js.map