"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "combineReducers", {
  enumerable: true,
  get: function get() {
    return _redux.combineReducers;
  }
});
Object.defineProperty(exports, "restrictPersistence", {
  enumerable: true,
  get: function get() {
    return _persist.restrictPersistence;
  }
});
Object.defineProperty(exports, "setPersistenceStorage", {
  enumerable: true,
  get: function get() {
    return _persist.setPersistenceStorage;
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
Object.defineProperty(exports, "createRegistry", {
  enumerable: true,
  get: function get() {
    return _registry.createRegistry;
  }
});
Object.defineProperty(exports, "withRehydration", {
  enumerable: true,
  get: function get() {
    return _deprecated.withRehydration;
  }
});
Object.defineProperty(exports, "loadAndPersist", {
  enumerable: true,
  get: function get() {
    return _deprecated.loadAndPersist;
  }
});
exports.setupPersistence = exports.registerResolvers = exports.registerSelectors = exports.registerActions = exports.registerReducer = exports.registerStore = exports.subscribe = exports.dispatch = exports.select = void 0;

var _redux = require("redux");

var _defaultRegistry = _interopRequireDefault(require("./default-registry"));

var _persist = require("./persist");

var _withSelect = _interopRequireDefault(require("./components/with-select"));

var _withDispatch = _interopRequireDefault(require("./components/with-dispatch"));

var _registryProvider = _interopRequireDefault(require("./components/registry-provider"));

var _registry = require("./registry");

var _deprecated = require("./deprecated");

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
var setupPersistence = _defaultRegistry.default.setupPersistence;
exports.setupPersistence = setupPersistence;