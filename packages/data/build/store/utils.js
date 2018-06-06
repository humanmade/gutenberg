"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onSubKey = undefined;

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require("babel-runtime/helpers/extends");

var _extends4 = _interopRequireDefault(_extends3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Higher-order reducer creator which creates a combined reducer object, keyed
 * by a property on the action object.
 *
 * @param {string} actionProperty Action property by which to key object.
 *
 * @return {Function} Higher-order reducer.
 */
var onSubKey = exports.onSubKey = function onSubKey(actionProperty) {
	return function (reducer) {
		return function () {
			var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var action = arguments[1];

			// Retrieve subkey from action. Do not track if undefined; useful for cases
			// where reducer is scoped by action shape.
			var key = action[actionProperty];
			if (key === undefined) {
				return state;
			}

			// Avoid updating state if unchanged. Note that this also accounts for a
			// reducer which returns undefined on a key which is not yet tracked.
			var nextKeyState = reducer(state[key], action);
			if (nextKeyState === state[key]) {
				return state;
			}

			return (0, _extends4.default)({}, state, (0, _defineProperty3.default)({}, key, nextKeyState));
		};
	};
};