import "core-js/modules/es6.function.name";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { map } from 'lodash';
/**
 * WordPress dependencies
 */

import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */

import Button from '../button';
import ButtonGroup from '../button-group';
import RangeControl from '../range-control';
export default function FontSizePicker(_ref) {
  var _ref$fontSizes = _ref.fontSizes,
      fontSizes = _ref$fontSizes === void 0 ? [] : _ref$fontSizes,
      fallbackFontSize = _ref.fallbackFontSize,
      value = _ref.value,
      onChange = _ref.onChange;
  return createElement(Fragment, null, createElement("div", {
    className: "components-font-size-picker__buttons"
  }, createElement(ButtonGroup, {
    "aria-label": __('Font Size')
  }, map(fontSizes, function (_ref2) {
    var name = _ref2.name,
        size = _ref2.size,
        shortName = _ref2.shortName;
    return createElement(Button, {
      key: size,
      isLarge: true,
      isPrimary: value === size,
      "aria-pressed": value === size,
      onClick: function onClick() {
        return onChange(size);
      }
    }, shortName || name);
  })), createElement(Button, {
    isLarge: true,
    onClick: function onClick() {
      return onChange(undefined);
    }
  }, __('Reset'))), createElement(RangeControl, {
    className: "components-font-size-picker__custom-input",
    label: __('Custom Size'),
    value: value || '',
    initialPosition: fallbackFontSize,
    onChange: onChange,
    min: 12,
    max: 100,
    beforeIcon: "editor-textcolor",
    afterIcon: "editor-textcolor"
  }));
}