'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = registerDataStore;

var _ = require('../');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _selectors = require('./selectors');

var selectors = _interopRequireWildcard(_selectors);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Internal dependencies
 */
function registerDataStore() {
	(0, _.registerStore)('core/data', {
		reducer: _reducer2.default,
		actions: actions,
		selectors: selectors
	});
}