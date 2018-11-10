"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.code = void 0;

var _element = require("@wordpress/element");

var _i18n = require("@wordpress/i18n");

var _richText = require("@wordpress/rich-text");

var _editor = require("@wordpress/editor");

/**
 * WordPress dependencies
 */
var name = 'core/code';
var code = {
  name: name,
  title: (0, _i18n.__)('Code'),
  tagName: 'code',
  className: null,
  edit: function edit(_ref) {
    var value = _ref.value,
        onChange = _ref.onChange;

    var onToggle = function onToggle() {
      return onChange((0, _richText.toggleFormat)(value, {
        type: name
      }));
    };

    return (0, _element.createElement)(_editor.RichTextShortcut, {
      type: "access",
      character: "x",
      onUse: onToggle
    });
  }
};
exports.code = code;
//# sourceMappingURL=index.js.map