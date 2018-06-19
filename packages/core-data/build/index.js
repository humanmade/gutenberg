'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _data = require('@wordpress/data');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _selectors = require('./selectors');

var selectors = _interopRequireWildcard(_selectors);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var _resolvers = require('./resolvers');

var resolvers = _interopRequireWildcard(_resolvers);

var _entities = require('./entities');

var _name = require('./name');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Internal dependencies
 */
var createEntityRecordGetter = function createEntityRecordGetter(source) {
	return _entities.defaultEntities.reduce(function (result, entity) {
		var kind = entity.kind,
		    name = entity.name;

		result[(0, _entities.getMethodName)(kind, name)] = function (state, key) {
			return source.getEntityRecord(state, kind, name, key);
		};
		result[(0, _entities.getMethodName)(kind, name, 'get', true)] = function (state) {
			return source.getEntityRecords(state, kind, name);
		};
		return result;
	}, {});
}; /**
    * WordPress dependencies
    */


var entityResolvers = createEntityRecordGetter(resolvers);
var entitySelectors = createEntityRecordGetter(selectors);

var store = (0, _data.registerStore)(_name.REDUCER_KEY, {
	reducer: _reducer2.default,
	actions: actions,
	selectors: (0, _extends3.default)({}, selectors, entitySelectors),
	resolvers: (0, _extends3.default)({}, resolvers, entityResolvers)
});

exports.default = store;