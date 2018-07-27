import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */

import PanelBody from './body';
import ColorIndicator from '../color-indicator';

function PanelColor(_ref) {
  var colorValue = _ref.colorValue,
      colorName = _ref.colorName,
      title = _ref.title,
      props = _objectWithoutProperties(_ref, ["colorValue", "colorName", "title"]);

  // translators: %s: The name of the color e.g: "vivid red" or color hex code if name is not available e.g: "#f00".
  var currentColorLabel = sprintf(__('(current color: %s)'), colorName || colorValue);
  return createElement(PanelBody, _extends({}, props, {
    title: [createElement("span", {
      className: "components-panel__color-title",
      key: "title"
    }, title), colorValue && createElement(ColorIndicator, {
      key: "color",
      className: "components-panel__color-indicator",
      "aria-label": currentColorLabel,
      colorValue: colorValue
    })]
  }));
}

export default PanelColor;