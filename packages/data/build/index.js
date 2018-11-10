"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "combineReducers", {
  enumerable: true,
  get: function get() {
    return _turboCombineReducers.default;
  }
});
Object.defineProperty(exports, "withSelect", {
  enumerable: true,
  get: function get() {
    return _withSelect.default;
  }
});
Object.defineProperty(exports, "withDispatch", {
  enumerable: true,
  get: function get() {
    return _withDispatch.default;
  }
});
Object.defineProperty(exports, "RegistryProvider", {
  enumerable: true,
  get: function get() {
    return _registryProvider.default;
  }
});
Object.defineProperty(exports, "RegistryConsumer", {
  enumerable: true,
  get: function get() {
    return _registryProvider.RegistryConsumer;
  }
});
Object.defineProperty(exports, "createRegistry", {
  enumerable: true,
  get: function get() {
    return _registry.createRegistry;
  }
});
exports.plugins = exports.use = exports.registerResolvers = exports.registerSelectors = exports.registerActions = exports.registerReducer = exports.registerStore = exports.registerGenericStore = exports.subscribe = exports.dispatch = exports.select = void 0;

var _turboCombineReducers = _interopRequireDefault(require("turbo-combine-reducers"));

var _defaultRegistry = _interopRequireDefault(require("./default-registry"));

var plugins = _interopRequireWildcard(require("./plugins"));

exports.plugins = plugins;

var _withSelect = _interopRequireDefault(require("./components/with-select"));

var _withDispatch = _interopRequireDefault(require("./components/with-dispatch"));

var _registryProvider = _interopRequireWildcard(require("./components/registry-provider"));

var _registry = require("./registry");

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */

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
var select = _defaultRegistry.default.select;
exports.select = select;
var dispatch = _defaultRegistry.default.dispatch;
exports.dispatch = dispatch;
var subscribe = _defaultRegistry.default.subscribe;
exports.subscribe = subscribe;
var registerGenericStore = _defaultRegistry.default.registerGenericStore;
exports.registerGenericStore = registerGenericStore;
var registerStore = _defaultRegistry.default.registerStore;
exports.registerStore = registerStore;
var registerReducer = _defaultRegistry.default.registerReducer;
exports.registerReducer = registerReducer;
var registerActions = _defaultRegistry.default.registerActions;
exports.registerActions = registerActions;
var registerSelectors = _defaultRegistry.default.registerSelectors;
exports.registerSelectors = registerSelectors;
var registerResolvers = _defaultRegistry.default.registerResolvers;
exports.registerResolvers = registerResolvers;
var use = _defaultRegistry.default.use;
exports.use = use;
//# sourceMappingURL=index.js.map