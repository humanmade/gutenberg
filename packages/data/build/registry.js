"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isActionLike = isActionLike;
exports.isAsyncIterable = isAsyncIterable;
exports.isIterable = isIterable;
exports.toAsyncIterable = toAsyncIterable;
exports.createRegistry = createRegistry;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("core-js/modules/web.dom.iterable");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

require("regenerator-runtime/runtime");

var _iterator3 = _interopRequireDefault(require("@babel/runtime/core-js/symbol/iterator"));

var _symbol = _interopRequireDefault(require("@babel/runtime/core-js/symbol"));

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _redux = require("redux");

var _lodash = require("lodash");

var _isShallowEqual = _interopRequireDefault(require("@wordpress/is-shallow-equal"));

var _store = _interopRequireDefault(require("./store"));

var _persist = require("./persist");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Returns true if the given argument appears to be a dispatchable action.
 *
 * @param {*} action Object to test.
 *
 * @return {boolean} Whether object is action-like.
 */
function isActionLike(action) {
  return !!action && typeof action.type === 'string';
}
/**
 * Returns true if the given object is an async iterable, or false otherwise.
 *
 * @param {*} object Object to test.
 *
 * @return {boolean} Whether object is an async iterable.
 */


function isAsyncIterable(object) {
  return !!object && typeof object[_symbol.default.asyncIterator] === 'function';
}
/**
 * Returns true if the given object is iterable, or false otherwise.
 *
 * @param {*} object Object to test.
 *
 * @return {boolean} Whether object is iterable.
 */


function isIterable(object) {
  return !!object && typeof object[_iterator3.default] === 'function';
}
/**
 * Normalizes the given object argument to an async iterable, asynchronously
 * yielding on a singular or array of generator yields or promise resolution.
 *
 * @param {*} object Object to normalize.
 *
 * @return {AsyncGenerator} Async iterable actions.
 */


function toAsyncIterable(object) {
  if (isAsyncIterable(object)) {
    return object;
  }

  return (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, maybeAction;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // Normalize as iterable...
            if (!isIterable(object)) {
              object = [object];
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context.prev = 4;
            _iterator2 = (0, _getIterator2.default)(object);

          case 6:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context.next = 14;
              break;
            }

            maybeAction = _step2.value;

            // ...of Promises.
            if (!(maybeAction instanceof _promise.default)) {
              maybeAction = _promise.default.resolve(maybeAction);
            }

            _context.next = 11;
            return maybeAction;

          case 11:
            _iteratorNormalCompletion2 = true;
            _context.next = 6;
            break;

          case 14:
            _context.next = 20;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context.t0;

          case 20:
            _context.prev = 20;
            _context.prev = 21;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 23:
            _context.prev = 23;

            if (!_didIteratorError2) {
              _context.next = 26;
              break;
            }

            throw _iteratorError2;

          case 26:
            return _context.finish(23);

          case 27:
            return _context.finish(20);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 16, 20, 28], [21,, 23, 27]]);
  }))();
}

function createRegistry() {
  var storeConfigs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var namespaces = {};
  var listeners = [];
  /**
   * Global listener called for each store's update.
   */

  function globalListener() {
    listeners.forEach(function (listener) {
      return listener();
    });
  }
  /**
   * Registers a new sub-reducer to the global state and returns a Redux-like store object.
   *
   * @param {string}  reducerKey  Reducer key.
   * @param {Object}  reducer     Reducer function.
   * @param {boolean} persist     Should the reducer be persisted.
   *
   * @return {Object} Store Object.
   */


  function registerReducer(reducerKey, reducer) {
    var persist = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var enhancers = [];

    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
      enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({
        name: reducerKey,
        instanceId: reducerKey
      }));
    }

    reducer = persist ? (0, _persist.withRehydration)(reducer) : reducer;
    var store = (0, _redux.createStore)(reducer, (0, _lodash.flowRight)(enhancers));
    namespaces[reducerKey] = {
      store: store,
      reducer: reducer,
      persist: persist
    }; // Customize subscribe behavior to call listeners only on effective change,
    // not on every dispatch.

    var lastState = store.getState();
    store.subscribe(function () {
      var state = store.getState();
      var hasChanged = state !== lastState;
      lastState = state;

      if (hasChanged) {
        globalListener();
      }
    });
    return store;
  }
  /**
   * Registers selectors for external usage.
   *
   * @param {string} reducerKey   Part of the state shape to register the
   *                              selectors for.
   * @param {Object} newSelectors Selectors to register. Keys will be used as the
   *                              public facing API. Selectors will get passed the
   *                              state as first argument.
   */


  function registerSelectors(reducerKey, newSelectors) {
    var store = namespaces[reducerKey].store;

    var createStateSelector = function createStateSelector(selector) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return selector.apply(void 0, [store.getState()].concat(args));
      };
    };

    namespaces[reducerKey].selectors = (0, _lodash.mapValues)(newSelectors, createStateSelector);
  }
  /**
   * Registers resolvers for a given reducer key. Resolvers are side effects
   * invoked once per argument set of a given selector call, used in ensuring
   * that the data needs for the selector are satisfied.
   *
   * @param {string} reducerKey   Part of the state shape to register the
   *                              resolvers for.
   * @param {Object} newResolvers Resolvers to register.
   */


  function registerResolvers(reducerKey, newResolvers) {
    var _select = select('core/data'),
        hasStartedResolution = _select.hasStartedResolution;

    var _dispatch = dispatch('core/data'),
        startResolution = _dispatch.startResolution,
        finishResolution = _dispatch.finishResolution;

    var createResolver = function createResolver(selector, selectorName) {
      // Don't modify selector behavior if no resolver exists.
      if (!newResolvers.hasOwnProperty(selectorName)) {
        return selector;
      }

      var store = namespaces[reducerKey].store; // Normalize resolver shape to object.

      var resolver = newResolvers[selectorName];

      if (!resolver.fulfill) {
        resolver = {
          fulfill: resolver
        };
      }

      function fulfill() {
        return _fulfill.apply(this, arguments);
      }

      function _fulfill() {
        _fulfill = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee2() {
          var _resolver2;

          var _len2,
              args,
              _key2,
              state,
              fulfillment,
              _iteratorNormalCompletion,
              _didIteratorError,
              _iteratorError,
              _iterator,
              _step,
              _value,
              maybeAction,
              _args2 = arguments;

          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  for (_len2 = _args2.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = _args2[_key2];
                  }

                  if (!hasStartedResolution(reducerKey, selectorName, args)) {
                    _context2.next = 3;
                    break;
                  }

                  return _context2.abrupt("return");

                case 3:
                  startResolution(reducerKey, selectorName, args); // At this point, selectors have already been pre-bound to inject
                  // state, it would not be otherwise provided to fulfill.

                  state = store.getState();
                  fulfillment = (_resolver2 = resolver).fulfill.apply(_resolver2, [state].concat(args)); // Attempt to normalize fulfillment as async iterable.

                  fulfillment = toAsyncIterable(fulfillment);

                  if (isAsyncIterable(fulfillment)) {
                    _context2.next = 10;
                    break;
                  }

                  finishResolution(reducerKey, selectorName, args);
                  return _context2.abrupt("return");

                case 10:
                  _iteratorNormalCompletion = true;
                  _didIteratorError = false;
                  _context2.prev = 12;
                  _iterator = (0, _asyncIterator2.default)(fulfillment);

                case 14:
                  _context2.next = 16;
                  return _iterator.next();

                case 16:
                  _step = _context2.sent;
                  _iteratorNormalCompletion = _step.done;
                  _context2.next = 20;
                  return _step.value;

                case 20:
                  _value = _context2.sent;

                  if (_iteratorNormalCompletion) {
                    _context2.next = 27;
                    break;
                  }

                  maybeAction = _value;

                  // Dispatch if it quacks like an action.
                  if (isActionLike(maybeAction)) {
                    store.dispatch(maybeAction);
                  }

                case 24:
                  _iteratorNormalCompletion = true;
                  _context2.next = 14;
                  break;

                case 27:
                  _context2.next = 33;
                  break;

                case 29:
                  _context2.prev = 29;
                  _context2.t0 = _context2["catch"](12);
                  _didIteratorError = true;
                  _iteratorError = _context2.t0;

                case 33:
                  _context2.prev = 33;
                  _context2.prev = 34;

                  if (!(!_iteratorNormalCompletion && _iterator.return != null)) {
                    _context2.next = 38;
                    break;
                  }

                  _context2.next = 38;
                  return _iterator.return();

                case 38:
                  _context2.prev = 38;

                  if (!_didIteratorError) {
                    _context2.next = 41;
                    break;
                  }

                  throw _iteratorError;

                case 41:
                  return _context2.finish(38);

                case 42:
                  return _context2.finish(33);

                case 43:
                  finishResolution(reducerKey, selectorName, args);

                case 44:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[12, 29, 33, 43], [34,, 38, 42]]);
        }));
        return _fulfill.apply(this, arguments);
      }

      if (typeof resolver.isFulfilled === 'function') {
        // When resolver provides its own fulfillment condition, fulfill
        // should only occur if not already fulfilled (opt-out condition).
        fulfill = (0, _lodash.overEvery)([function () {
          var _resolver;

          var state = store.getState();

          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return !(_resolver = resolver).isFulfilled.apply(_resolver, [state].concat(args));
        }, fulfill]);
      }

      return function () {
        fulfill.apply(void 0, arguments);
        return selector.apply(void 0, arguments);
      };
    };

    namespaces[reducerKey].selectors = (0, _lodash.mapValues)(namespaces[reducerKey].selectors, createResolver);
  }
  /**
   * Registers actions for external usage.
   *
   * @param {string} reducerKey   Part of the state shape to register the
   *                              selectors for.
   * @param {Object} newActions   Actions to register.
   */


  function registerActions(reducerKey, newActions) {
    var store = namespaces[reducerKey].store;

    var createBoundAction = function createBoundAction(action) {
      return function () {
        return store.dispatch(action.apply(void 0, arguments));
      };
    };

    namespaces[reducerKey].actions = (0, _lodash.mapValues)(newActions, createBoundAction);
  }
  /**
   * Convenience for registering reducer with actions and selectors.
   *
   * @param {string} reducerKey Reducer key.
   * @param {Object} options    Store description (reducer, actions, selectors, resolvers).
   *
   * @return {Object} Registered store object.
   */


  function registerStore(reducerKey, options) {
    if (!options.reducer) {
      throw new TypeError('Must specify store reducer');
    }

    var store = registerReducer(reducerKey, options.reducer, options.persist);

    if (options.actions) {
      registerActions(reducerKey, options.actions);
    }

    if (options.selectors) {
      registerSelectors(reducerKey, options.selectors);
    }

    if (options.resolvers) {
      registerResolvers(reducerKey, options.resolvers);
    }

    return store;
  }
  /**
   * Subscribe to changes to any data.
   *
   * @param {Function}   listener Listener function.
   *
   * @return {Function}           Unsubscribe function.
   */


  var subscribe = function subscribe(listener) {
    listeners.push(listener);
    return function () {
      listeners = (0, _lodash.without)(listeners, listener);
    };
  };
  /**
   * Calls a selector given the current state and extra arguments.
   *
   * @param {string} reducerKey Part of the state shape to register the
   *                            selectors for.
   *
   * @return {*} The selector's returned value.
   */


  function select(reducerKey) {
    return (0, _lodash.get)(namespaces, [reducerKey, 'selectors']);
  }
  /**
   * Returns the available actions for a part of the state.
   *
   * @param {string} reducerKey Part of the state shape to dispatch the
   *                            action for.
   *
   * @return {*} The action's returned value.
   */


  function dispatch(reducerKey) {
    return (0, _lodash.get)(namespaces, [reducerKey, 'actions']);
  }
  /**
   * Setup persistence for the current registry.
   *
   * @param {string} storageKey The storage key.
   */


  function setupPersistence(storageKey) {
    var persistenceStorage = (0, _persist.getPersistenceStorage)(); // Load initially persisted value

    var previousValue = null;
    var persistedString = persistenceStorage.getItem(storageKey);

    if (persistedString) {
      var persistedData = JSON.parse(persistedString);
      (0, _entries.default)(namespaces).forEach(function (_ref2) {
        var _ref3 = (0, _slicedToArray2.default)(_ref2, 2),
            reducerKey = _ref3[0],
            _ref3$ = _ref3[1],
            store = _ref3$.store,
            persist = _ref3$.persist;

        if (!persist) {
          return;
        }

        var persistedState = (0, _objectSpread2.default)({}, store.getState(), (0, _lodash.get)(persistedData, reducerKey));
        store.dispatch({
          type: 'REDUX_REHYDRATE',
          payload: persistedState
        });
      }); // Avoid initial save.

      previousValue = persistedData;
    }

    var triggerPersist = function triggerPersist() {
      var newValue = (0, _entries.default)(namespaces).filter(function (_ref4) {
        var _ref5 = (0, _slicedToArray2.default)(_ref4, 2),
            persist = _ref5[1].persist;

        return persist;
      }).reduce(function (memo, _ref6) {
        var _ref7 = (0, _slicedToArray2.default)(_ref6, 2),
            reducerKey = _ref7[0],
            _ref7$ = _ref7[1],
            reducer = _ref7$.reducer,
            store = _ref7$.store;

        memo[reducerKey] = reducer(store.getState(), {
          type: 'SERIALIZE',
          previousState: (0, _lodash.get)(previousValue, reducerKey)
        });
        return memo;
      }, {});

      if (!(0, _isShallowEqual.default)(newValue, previousValue)) {
        persistenceStorage.setItem(storageKey, (0, _stringify.default)(newValue));
      }

      previousValue = newValue;
    }; // Persist updated preferences


    subscribe(triggerPersist);
    triggerPersist();
  }

  (0, _entries.default)((0, _objectSpread2.default)({
    'core/data': _store.default
  }, storeConfigs)).map(function (_ref8) {
    var _ref9 = (0, _slicedToArray2.default)(_ref8, 2),
        name = _ref9[0],
        config = _ref9[1];

    return registerStore(name, config);
  });
  return {
    registerReducer: registerReducer,
    registerSelectors: registerSelectors,
    registerResolvers: registerResolvers,
    registerActions: registerActions,
    registerStore: registerStore,
    subscribe: subscribe,
    select: select,
    dispatch: dispatch,
    setupPersistence: setupPersistence
  };
}