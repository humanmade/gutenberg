'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.withDispatch = exports.withSelect = exports.subscribe = exports.combineReducers = exports.withRehydratation = exports.withRehydration = exports.loadAndPersist = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _iterator3 = require('babel-runtime/core-js/symbol/iterator');

var _iterator4 = _interopRequireDefault(_iterator3);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncIterator2 = require('babel-runtime/helpers/asyncIterator');

var _asyncIterator3 = _interopRequireDefault(_asyncIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _persist = require('./persist');

Object.defineProperty(exports, 'loadAndPersist', {
	enumerable: true,
	get: function get() {
		return _persist.loadAndPersist;
	}
});
Object.defineProperty(exports, 'withRehydration', {
	enumerable: true,
	get: function get() {
		return _persist.withRehydration;
	}
});
Object.defineProperty(exports, 'withRehydratation', {
	enumerable: true,
	get: function get() {
		return _persist.withRehydratation;
	}
});
exports.globalListener = globalListener;
exports.registerStore = registerStore;
exports.registerReducer = registerReducer;
exports.registerSelectors = registerSelectors;
exports.registerResolvers = registerResolvers;
exports.registerActions = registerActions;
exports.select = select;
exports.dispatch = dispatch;
exports.isActionLike = isActionLike;
exports.isAsyncIterable = isAsyncIterable;
exports.isIterable = isIterable;
exports.toAsyncIterable = toAsyncIterable;

var _redux = require('redux');

var _lodash = require('lodash');

var _element = require('@wordpress/element');

var _isShallowEqual = require('@wordpress/is-shallow-equal');

var _isShallowEqual2 = _interopRequireDefault(_isShallowEqual);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Module constants
 */
var stores = {};
var selectors = {};
var actions = {};
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

	var store = registerReducer(reducerKey, options.reducer);

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
 * Registers a new sub-reducer to the global state and returns a Redux-like store object.
 *
 * @param {string} reducerKey Reducer key.
 * @param {Object} reducer    Reducer function.
 *
 * @return {Object} Store Object.
 */
function registerReducer(reducerKey, reducer) {
	var enhancers = [];
	if (window.__REDUX_DEVTOOLS_EXTENSION__) {
		enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({ name: reducerKey, instanceId: reducerKey }));
	}
	var store = (0, _redux.createStore)(reducer, (0, _lodash.flowRight)(enhancers));
	stores[reducerKey] = store;

	// Customize subscribe behavior to call listeners only on effective change,
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
 * The combineReducers helper function turns an object whose values are different
 * reducing functions into a single reducing function you can pass to registerReducer.
 *
 * @param {Object} reducers An object whose values correspond to different reducing
 *                          functions that need to be combined into one.
 *
 * @return {Function}       A reducer that invokes every reducer inside the reducers
 *                          object, and constructs a state object with the same shape.
 */
exports.combineReducers = _redux.combineReducers;

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
	var store = stores[reducerKey];
	var createStateSelector = function createStateSelector(selector) {
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return selector.apply(undefined, [store.getState()].concat(args));
		};
	};
	selectors[reducerKey] = (0, _lodash.mapValues)(newSelectors, createStateSelector);
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
		var fulfill = function () {
			var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
				var _resolver;

				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var state, fulfillment, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, maybeAction;

				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								if (!hasStartedResolution(reducerKey, selectorName, args)) {
									_context.next = 2;
									break;
								}

								return _context.abrupt('return');

							case 2:

								startResolution(reducerKey, selectorName, args);

								// At this point, selectors have already been pre-bound to inject
								// state, it would not be otherwise provided to fulfill.
								state = store.getState();
								fulfillment = (_resolver = resolver).fulfill.apply(_resolver, [state].concat((0, _toConsumableArray3.default)(args)));

								// Attempt to normalize fulfillment as async iterable.

								fulfillment = toAsyncIterable(fulfillment);

								if (isAsyncIterable(fulfillment)) {
									_context.next = 8;
									break;
								}

								return _context.abrupt('return');

							case 8:
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 11;
								_iterator = (0, _asyncIterator3.default)(fulfillment);

							case 13:
								_context.next = 15;
								return _iterator.next();

							case 15:
								_step = _context.sent;
								_iteratorNormalCompletion = _step.done;
								_context.next = 19;
								return _step.value;

							case 19:
								_value = _context.sent;

								if (_iteratorNormalCompletion) {
									_context.next = 26;
									break;
								}

								maybeAction = _value;

								// Dispatch if it quacks like an action.
								if (isActionLike(maybeAction)) {
									store.dispatch(maybeAction);
								}

							case 23:
								_iteratorNormalCompletion = true;
								_context.next = 13;
								break;

							case 26:
								_context.next = 32;
								break;

							case 28:
								_context.prev = 28;
								_context.t0 = _context['catch'](11);
								_didIteratorError = true;
								_iteratorError = _context.t0;

							case 32:
								_context.prev = 32;
								_context.prev = 33;

								if (!(!_iteratorNormalCompletion && _iterator.return)) {
									_context.next = 37;
									break;
								}

								_context.next = 37;
								return _iterator.return();

							case 37:
								_context.prev = 37;

								if (!_didIteratorError) {
									_context.next = 40;
									break;
								}

								throw _iteratorError;

							case 40:
								return _context.finish(37);

							case 41:
								return _context.finish(32);

							case 42:

								finishResolution(reducerKey, selectorName, args);

							case 43:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[11, 28, 32, 42], [33,, 37, 41]]);
			}));

			return function fulfill() {
				return _ref.apply(this, arguments);
			};
		}();

		// Don't modify selector behavior if no resolver exists.
		if (!newResolvers.hasOwnProperty(selectorName)) {
			return selector;
		}

		var store = stores[reducerKey];

		// Normalize resolver shape to object.
		var resolver = newResolvers[selectorName];
		if (!resolver.fulfill) {
			resolver = { fulfill: resolver };
		}

		if (typeof resolver.isFulfilled === 'function') {
			// When resolver provides its own fulfillment condition, fulfill
			// should only occur if not already fulfilled (opt-out condition).
			fulfill = (0, _lodash.overEvery)([function () {
				var _resolver2;

				for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
					args[_key3] = arguments[_key3];
				}

				var state = store.getState();
				return !(_resolver2 = resolver).isFulfilled.apply(_resolver2, [state].concat(args));
			}, fulfill]);
		}

		return function () {
			fulfill.apply(undefined, arguments);
			return selector.apply(undefined, arguments);
		};
	};

	selectors[reducerKey] = (0, _lodash.mapValues)(selectors[reducerKey], createResolver);
}

/**
 * Registers actions for external usage.
 *
 * @param {string} reducerKey   Part of the state shape to register the
 *                              selectors for.
 * @param {Object} newActions   Actions to register.
 */
function registerActions(reducerKey, newActions) {
	var store = stores[reducerKey];
	var createBoundAction = function createBoundAction(action) {
		return function () {
			return store.dispatch(action.apply(undefined, arguments));
		};
	};
	actions[reducerKey] = (0, _lodash.mapValues)(newActions, createBoundAction);
}

/**
 * Subscribe to changes to any data.
 *
 * @param {Function}   listener Listener function.
 *
 * @return {Function}           Unsubscribe function.
 */
var _subscribe = function _subscribe(listener) {
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
exports.subscribe = _subscribe;
function select(reducerKey) {
	return selectors[reducerKey];
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
	return actions[reducerKey];
}

/**
 * Higher-order component used to inject state-derived props using registered
 * selectors.
 *
 * @param {Function} mapStateToProps Function called on every state change,
 *                                   expected to return object of props to
 *                                   merge with the component's own props.
 *
 * @return {Component} Enhanced component with merged state data props.
 */
var withSelect = exports.withSelect = function withSelect(mapStateToProps) {
	return (0, _element.createHigherOrderComponent)(function (WrappedComponent) {
		return function (_Component) {
			(0, _inherits3.default)(ComponentWithSelect, _Component);

			function ComponentWithSelect() {
				(0, _classCallCheck3.default)(this, ComponentWithSelect);

				var _this = (0, _possibleConstructorReturn3.default)(this, (ComponentWithSelect.__proto__ || (0, _getPrototypeOf2.default)(ComponentWithSelect)).apply(this, arguments));

				_this.runSelection = _this.runSelection.bind(_this);

				/**
     * Boolean tracking known render conditions (own props or merged
     * props update) for `shouldComponentUpdate`.
     *
     * @type {boolean}
     */
				_this.shouldComponentUpdate = false;

				_this.state = {};
				return _this;
			}

			(0, _createClass3.default)(ComponentWithSelect, [{
				key: 'shouldComponentUpdate',
				value: function shouldComponentUpdate() {
					return this.shouldComponentUpdate;
				}
			}, {
				key: 'componentWillMount',
				value: function componentWillMount() {
					this.subscribe();

					// Populate initial state.
					this.runSelection();
				}
			}, {
				key: 'componentWillReceiveProps',
				value: function componentWillReceiveProps(nextProps) {
					if (!(0, _isShallowEqual2.default)(nextProps, this.props)) {
						this.runSelection(nextProps);
						this.shouldComponentUpdate = true;
					}
				}
			}, {
				key: 'componentWillUnmount',
				value: function componentWillUnmount() {
					this.unsubscribe();

					// While above unsubscribe avoids future listener calls, callbacks
					// are snapshotted before being invoked, so if unmounting occurs
					// during a previous callback, we need to explicitly track and
					// avoid the `runSelection` that is scheduled to occur.
					this.isUnmounting = true;
				}
			}, {
				key: 'subscribe',
				value: function subscribe() {
					this.unsubscribe = _subscribe(this.runSelection);
				}
			}, {
				key: 'runSelection',
				value: function runSelection() {
					var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

					if (this.isUnmounting) {
						return;
					}

					var mergeProps = this.state.mergeProps;

					var nextMergeProps = mapStateToProps(select, props) || {};

					if (!(0, _isShallowEqual2.default)(nextMergeProps, mergeProps)) {
						this.setState({
							mergeProps: nextMergeProps
						});

						this.shouldComponentUpdate = true;
					}
				}
			}, {
				key: 'render',
				value: function render() {
					this.shouldComponentUpdate = false;

					return (0, _element.createElement)(WrappedComponent, (0, _extends3.default)({}, this.props, this.state.mergeProps));
				}
			}]);
			return ComponentWithSelect;
		}(_element.Component);
	}, 'withSelect');
};

/**
 * Higher-order component used to add dispatch props using registered action
 * creators.
 *
 * @param {Object} mapDispatchToProps Object of prop names where value is a
 *                                    dispatch-bound action creator, or a
 *                                    function to be called with with the
 *                                    component's props and returning an
 *                                    action creator.
 *
 * @return {Component} Enhanced component with merged dispatcher props.
 */
var withDispatch = exports.withDispatch = function withDispatch(mapDispatchToProps) {
	return (0, _element.createHigherOrderComponent)((0, _element.compose)([_element.pure, function (WrappedComponent) {
		return function (_Component2) {
			(0, _inherits3.default)(ComponentWithDispatch, _Component2);

			function ComponentWithDispatch() {
				(0, _classCallCheck3.default)(this, ComponentWithDispatch);

				var _this2 = (0, _possibleConstructorReturn3.default)(this, (ComponentWithDispatch.__proto__ || (0, _getPrototypeOf2.default)(ComponentWithDispatch)).apply(this, arguments));

				_this2.proxyProps = {};
				return _this2;
			}

			(0, _createClass3.default)(ComponentWithDispatch, [{
				key: 'componentWillMount',
				value: function componentWillMount() {
					this.setProxyProps(this.props);
				}
			}, {
				key: 'componentWillUpdate',
				value: function componentWillUpdate(nextProps) {
					this.setProxyProps(nextProps);
				}
			}, {
				key: 'proxyDispatch',
				value: function proxyDispatch(propName) {
					var _mapDispatchToProps;

					for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
						args[_key4 - 1] = arguments[_key4];
					}

					// Original dispatcher is a pre-bound (dispatching) action creator.
					(_mapDispatchToProps = mapDispatchToProps(dispatch, this.props))[propName].apply(_mapDispatchToProps, args);
				}
			}, {
				key: 'setProxyProps',
				value: function setProxyProps(props) {
					var _this3 = this;

					// Assign as instance property so that in reconciling subsequent
					// renders, the assigned prop values are referentially equal.
					var propsToDispatchers = mapDispatchToProps(dispatch, props);
					this.proxyProps = (0, _lodash.mapValues)(propsToDispatchers, function (dispatcher, propName) {
						// Prebind with prop name so we have reference to the original
						// dispatcher to invoke. Track between re-renders to avoid
						// creating new function references every render.
						if (_this3.proxyProps.hasOwnProperty(propName)) {
							return _this3.proxyProps[propName];
						}

						return _this3.proxyDispatch.bind(_this3, propName);
					});
				}
			}, {
				key: 'render',
				value: function render() {
					return (0, _element.createElement)(WrappedComponent, (0, _extends3.default)({}, this.props, this.proxyProps));
				}
			}]);
			return ComponentWithDispatch;
		}(_element.Component);
	}]), 'withDispatch');
};

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
	return !!object && typeof object[_symbol2.default.asyncIterator] === 'function';
}

/**
 * Returns true if the given object is iterable, or false otherwise.
 *
 * @param {*} object Object to test.
 *
 * @return {boolean} Whether object is iterable.
 */
function isIterable(object) {
	return !!object && typeof object[_iterator4.default] === 'function';
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

	return _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
		var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, maybeAction;

		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						// Normalize as iterable...
						if (!isIterable(object)) {
							object = [object];
						}

						_iteratorNormalCompletion2 = true;
						_didIteratorError2 = false;
						_iteratorError2 = undefined;
						_context2.prev = 4;
						_iterator2 = (0, _getIterator3.default)(object);

					case 6:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							_context2.next = 16;
							break;
						}

						maybeAction = _step2.value;

						// ...of Promises.
						if (!(maybeAction instanceof _promise2.default)) {
							maybeAction = _promise2.default.resolve(maybeAction);
						}

						_context2.next = 11;
						return _asyncGenerator3.default.await(maybeAction);

					case 11:
						_context2.next = 13;
						return _context2.sent;

					case 13:
						_iteratorNormalCompletion2 = true;
						_context2.next = 6;
						break;

					case 16:
						_context2.next = 22;
						break;

					case 18:
						_context2.prev = 18;
						_context2.t0 = _context2['catch'](4);
						_didIteratorError2 = true;
						_iteratorError2 = _context2.t0;

					case 22:
						_context2.prev = 22;
						_context2.prev = 23;

						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}

					case 25:
						_context2.prev = 25;

						if (!_didIteratorError2) {
							_context2.next = 28;
							break;
						}

						throw _iteratorError2;

					case 28:
						return _context2.finish(25);

					case 29:
						return _context2.finish(22);

					case 30:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this, [[4, 18, 22, 30], [23,, 25, 29]]);
	}))();
}

(0, _store2.default)();