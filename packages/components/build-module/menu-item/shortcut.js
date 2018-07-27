import { createElement } from "@wordpress/element";

function MenuItemsShortcut(_ref) {
  var shortcut = _ref.shortcut;

  if (!shortcut) {
    return null;
  }

  return createElement("span", {
    className: "components-menu-item__shortcut"
  }, shortcut);
}

export default MenuItemsShortcut;