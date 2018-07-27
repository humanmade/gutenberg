"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

require("core-js/modules/es6.function.name");

var _data = require("@wordpress/data");

var _reducer = _interopRequireDefault(require("./reducer"));

var selectors = _interopRequireWildcard(require("./selectors"));

var actions = _interopRequireWildcard(require("./actions"));

var resolvers = _interopRequireWildcard(require("./resolvers"));

var _entities = require("./entities");

var _name = require("./name");

/**
 * WordPress dependencies
 */

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
};

var entityResolvers = createEntityRecordGetter(resolvers);
var entitySelectors = createEntityRecordGetter(selectors);
var store = (0, _data.registerStore)(_name.REDUCER_KEY, {
  reducer: _reducer.default,
  actions: actions,
  selectors: (0, _objectSpread2.default)({}, selectors, entitySelectors),
  resolvers: (0, _objectSpread2.default)({}, resolvers, entityResolvers)
});
var _default = store;
exports.default = _default;