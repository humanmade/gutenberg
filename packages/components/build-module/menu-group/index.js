import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { Children } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { withInstanceId } from '@wordpress/compose';
/**
 * Internal dependencies
 */

import { NavigableMenu } from '../navigable-container';
export function MenuGroup(_ref) {
  var children = _ref.children,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? '' : _ref$className,
      filterName = _ref.filterName,
      instanceId = _ref.instanceId,
      label = _ref.label;
  var childrenArray = Children.toArray(children);
  var menuItems = filterName ? applyFilters(filterName, childrenArray) : childrenArray;

  if (!Array.isArray(menuItems) || !menuItems.length) {
    return null;
  }

  var labelId = "components-menu-group-label-".concat(instanceId);
  var classNames = classnames(className, 'components-menu-group');
  return createElement("div", {
    className: classNames
  }, label && createElement("div", {
    className: "components-menu-group__label",
    id: labelId
  }, label), createElement(NavigableMenu, {
    orientation: "vertical",
    "aria-labelledby": labelId
  }, menuItems));
}
export default withInstanceId(MenuGroup);