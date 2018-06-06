'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _equivalentKeyMap = require('equivalent-key-map');

var _equivalentKeyMap2 = _interopRequireDefault(_equivalentKeyMap);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reducer function returning next state for selector resolution, object form:
 *
 *  reducerKey -> selectorName -> EquivalentKeyMap<Array,boolean>
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @returns {Object} Next state.
 */
var isResolved = (0, _lodash.flowRight)([(0, _utils.onSubKey)('reducerKey'), (0, _utils.onSubKey)('selectorName')])(function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new _equivalentKeyMap2.default();
  var action = arguments[1];

  switch (action.type) {
    case 'START_RESOLUTION':
    case 'FINISH_RESOLUTION':
      var isStarting = action.type === 'START_RESOLUTION';
      var nextState = new _equivalentKeyMap2.default(state);
      nextState.set(action.args, isStarting);
      return nextState;
  }

  return state;
});

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
exports.default = isResolved;