import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { toggleFormat } from '@wordpress/rich-text';
import { RichTextShortcut } from '@wordpress/editor';
var name = 'core/code';
export var code = {
  name: name,
  title: __('Code'),
  tagName: 'code',
  className: null,
  edit: function edit(_ref) {
    var value = _ref.value,
        onChange = _ref.onChange;

    var onToggle = function onToggle() {
      return onChange(toggleFormat(value, {
        type: name
      }));
    };

    return createElement(RichTextShortcut, {
      type: "access",
      character: "x",
      onUse: onToggle
    });
  }
};
//# sourceMappingURL=index.js.map