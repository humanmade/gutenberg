import _objectSpread from "@babel/runtime/helpers/objectSpread";
import "core-js/modules/es6.function.name";

/**
 * WordPress dependencies
 */
import { registerStore } from '@wordpress/data';
/**
 * Internal dependencies
 */

import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';
import { defaultEntities, getMethodName } from './entities';
import { REDUCER_KEY } from './name';

var createEntityRecordGetter = function createEntityRecordGetter(source) {
  return defaultEntities.reduce(function (result, entity) {
    var kind = entity.kind,
        name = entity.name;

    result[getMethodName(kind, name)] = function (state, key) {
      return source.getEntityRecord(state, kind, name, key);
    };

    result[getMethodName(kind, name, 'get', true)] = function (state) {
      return source.getEntityRecords(state, kind, name);
    };

    return result;
  }, {});
};

var entityResolvers = createEntityRecordGetter(resolvers);
var entitySelectors = createEntityRecordGetter(selectors);
var store = registerStore(REDUCER_KEY, {
  reducer: reducer,
  actions: actions,
  selectors: _objectSpread({}, selectors, entitySelectors),
  resolvers: _objectSpread({}, resolvers, entityResolvers)
});
export default store;