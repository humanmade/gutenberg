/**
 * External dependencies
 */
import combineReducers from 'turbo-combine-reducers';
/**
 * Internal dependencies
 */

import defaultRegistry from './default-registry';
import * as plugins from './plugins';
export { default as withSelect } from './components/with-select';
export { default as withDispatch } from './components/with-dispatch';
export { default as RegistryProvider, RegistryConsumer } from './components/registry-provider';
export { createRegistry } from './registry';
export { plugins };
/**
 * The combineReducers helper function turns an object whose values are different
 * reducing functions into a single reducing function you can pass to registerReducer.
 *
 * @param {Object} reducers An object whose values correspond to different reducing
 *                          functions that need to be combined into one.
 *
 * @return {Function}       A reducer that invokes every reducer inside the reducers
 *                          object, and constructs a state object with the same shape.
 */

export { combineReducers };
export var select = defaultRegistry.select;
export var dispatch = defaultRegistry.dispatch;
export var subscribe = defaultRegistry.subscribe;
export var registerGenericStore = defaultRegistry.registerGenericStore;
export var registerStore = defaultRegistry.registerStore;
export var registerReducer = defaultRegistry.registerReducer;
export var registerActions = defaultRegistry.registerActions;
export var registerSelectors = defaultRegistry.registerSelectors;
export var registerResolvers = defaultRegistry.registerResolvers;
export var use = defaultRegistry.use;
//# sourceMappingURL=index.js.map