"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSlotFill = createSlotFill;
Object.defineProperty(exports, "Slot", {
  enumerable: true,
  get: function get() {
    return _slot.default;
  }
});
Object.defineProperty(exports, "Fill", {
  enumerable: true,
  get: function get() {
    return _fill.default;
  }
});
Object.defineProperty(exports, "Provider", {
  enumerable: true,
  get: function get() {
    return _provider.default;
  }
});

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slot = _interopRequireDefault(require("./slot"));

var _fill = _interopRequireDefault(require("./fill"));

var _provider = _interopRequireDefault(require("./provider"));

/**
 * Internal dependencies
 */
function createSlotFill(name) {
  var FillComponent = function FillComponent(_ref) {
    var children = _ref.children,
        props = (0, _objectWithoutProperties2.default)(_ref, ["children"]);
    return (0, _element.createElement)(_fill.default, (0, _extends2.default)({
      name: name
    }, props), children);
  };

  FillComponent.displayName = name + 'Fill';

  var SlotComponent = function SlotComponent(_ref2) {
    var children = _ref2.children,
        props = (0, _objectWithoutProperties2.default)(_ref2, ["children"]);
    return (0, _element.createElement)(_slot.default, (0, _extends2.default)({
      name: name
    }, props), children);
  };

  SlotComponent.displayName = name + 'Slot';
  return {
    Fill: FillComponent,
    Slot: SlotComponent
  };
}