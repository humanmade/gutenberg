"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _data = require("@wordpress/data");

var _reducer = _interopRequireDefault(require("./reducer"));

var actions = _interopRequireWildcard(require("./actions"));

var selectors = _interopRequireWildcard(require("./selectors"));

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
var REDUCER_KEY = 'preferences';
var store = (0, _data.registerStore)('core/nux', {
  reducer: (0, _data.restrictPersistence)(_reducer.default, REDUCER_KEY),
  actions: actions,
  selectors: selectors,
  persist: true
});
var _default = store;
exports.default = _default;