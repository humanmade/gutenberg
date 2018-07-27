import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import { createElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import Slot from './slot';
import Fill from './fill';
import Provider from './provider';
export { Slot };
export { Fill };
export { Provider };
export function createSlotFill(name) {
  var FillComponent = function FillComponent(_ref) {
    var children = _ref.children,
        props = _objectWithoutProperties(_ref, ["children"]);

    return createElement(Fill, _extends({
      name: name
    }, props), children);
  };

  FillComponent.displayName = name + 'Fill';

  var SlotComponent = function SlotComponent(_ref2) {
    var children = _ref2.children,
        props = _objectWithoutProperties(_ref2, ["children"]);

    return createElement(Slot, _extends({
      name: name
    }, props), children);
  };

  SlotComponent.displayName = name + 'Slot';
  return {
    Fill: FillComponent,
    Slot: SlotComponent
  };
}