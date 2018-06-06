import _Promise from 'babel-runtime/core-js/promise';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _asyncGenerator from 'babel-runtime/helpers/asyncGenerator';
import _Symbol$iterator from 'babel-runtime/core-js/symbol/iterator';
import _Symbol from 'babel-runtime/core-js/symbol';
import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
import _asyncIterator from 'babel-runtime/helpers/asyncIterator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
/**
 * External dependencies
 */
import { combineReducers, createStore } from 'redux';
import { flowRight, without, mapValues, overEvery } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, compose, createElement, createHigherOrderComponent, pure } from '@wordpress/element';
import isShallowEqual from '@wordpress/is-shallow-equal';

/**
 * Internal dependencies
 */
import registerDataStore from './store';

export { loadAndPersist, withRehydration, withRehydratation } from './persist';

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
export function globalListener() {
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
export function registerStore(reducerKey, options) {
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
export function registerReducer(reducerKey, reducer) {
	var enhancers = [];
	if (window.__REDUX_DEVTOOLS_EXTENSION__) {
		enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({ name: reducerKey, instanceId: reducerKey }));
	}
	var store = createStore(reducer, flowRight(enhancers));
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
export { combineReducers };

/**
 * Registers selectors for external usage.
 *
 * @param {string} reducerKey   Part of the state shape to register the
 *                              selectors for.
 * @param {Object} newSelectors Selectors to register. Keys will be used as the
 *                              public facing API. Selectors will get passed the
 *                              state as first argument.
 */
export function registerSelectors(reducerKey, newSelectors) {
	var store = stores[reducerKey];
	var createStateSelector = function createStateSelector(selector) {
		return function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return selector.apply(undefined, [store.getState()].concat(args));
		};
	};
	selectors[reducerKey] = mapValues(newSelectors, createStateSelector);
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
export function registerResolvers(reducerKey, newResolvers) {
	var _select = select('core/data'),
	    hasStartedResolution = _select.hasStartedResolution;

	var _dispatch = dispatch('core/data'),
	    startResolution = _dispatch.startResolution,
	    finishResolution = _dispatch.finishResolution;

	var createResolver = function createResolver(selector, selectorName) {
		var fulfill = function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
				var _resolver;

				for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					args[_key2] = arguments[_key2];
				}

				var state, fulfillment, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, maybeAction;

				return _regeneratorRuntime.wrap(function _callee$(_context) {
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
								fulfillment = (_resolver = resolver).fulfill.apply(_resolver, [state].concat(_toConsumableArray(args)));

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
								_iterator = _asyncIterator(fulfillment);

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
			fulfill = overEvery([function () {
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

	selectors[reducerKey] = mapValues(selectors[reducerKey], createResolver);
}

/**
 * Registers actions for external usage.
 *
 * @param {string} reducerKey   Part of the state shape to register the
 *                              selectors for.
 * @param {Object} newActions   Actions to register.
 */
export function registerActions(reducerKey, newActions) {
	var store = stores[reducerKey];
	var createBoundAction = function createBoundAction(action) {
		return function () {
			return store.dispatch(action.apply(undefined, arguments));
		};
	};
	actions[reducerKey] = mapValues(newActions, createBoundAction);
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
		listeners = without(listeners, listener);
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
export { _subscribe as subscribe };
export function select(reducerKey) {
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
export function dispatch(reducerKey) {
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
export var withSelect = function withSelect(mapStateToProps) {
	return createHigherOrderComponent(function (WrappedComponent) {
		return function (_Component) {
			_inherits(ComponentWithSelect, _Component);

			function ComponentWithSelect() {
				_classCallCheck(this, ComponentWithSelect);

				var _this = _possibleConstructorReturn(this, (ComponentWithSelect.__proto__ || _Object$getPrototypeOf(ComponentWithSelect)).apply(this, arguments));

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

			_createClass(ComponentWithSelect, [{
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
					if (!isShallowEqual(nextProps, this.props)) {
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

					if (!isShallowEqual(nextMergeProps, mergeProps)) {
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

					return createElement(WrappedComponent, _extends({}, this.props, this.state.mergeProps));
				}
			}]);

			return ComponentWithSelect;
		}(Component);
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
export var withDispatch = function withDispatch(mapDispatchToProps) {
	return createHigherOrderComponent(compose([pure, function (WrappedComponent) {
		return function (_Component2) {
			_inherits(ComponentWithDispatch, _Component2);

			function ComponentWithDispatch() {
				_classCallCheck(this, ComponentWithDispatch);

				var _this2 = _possibleConstructorReturn(this, (ComponentWithDispatch.__proto__ || _Object$getPrototypeOf(ComponentWithDispatch)).apply(this, arguments));

				_this2.proxyProps = {};
				return _this2;
			}

			_createClass(ComponentWithDispatch, [{
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
					this.proxyProps = mapValues(propsToDispatchers, function (dispatcher, propName) {
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
					return createElement(WrappedComponent, _extends({}, this.props, this.proxyProps));
				}
			}]);

			return ComponentWithDispatch;
		}(Component);
	}]), 'withDispatch');
};

/**
 * Returns true if the given argument appears to be a dispatchable action.
 *
 * @param {*} action Object to test.
 *
 * @return {boolean} Whether object is action-like.
 */
export function isActionLike(action) {
	return !!action && typeof action.type === 'string';
}

/**
 * Returns true if the given object is an async iterable, or false otherwise.
 *
 * @param {*} object Object to test.
 *
 * @return {boolean} Whether object is an async iterable.
 */
export function isAsyncIterable(object) {
	return !!object && typeof object[_Symbol.asyncIterator] === 'function';
}

/**
 * Returns true if the given object is iterable, or false otherwise.
 *
 * @param {*} object Object to test.
 *
 * @return {boolean} Whether object is iterable.
 */
export function isIterable(object) {
	return !!object && typeof object[_Symbol$iterator] === 'function';
}

/**
 * Normalizes the given object argument to an async iterable, asynchronously
 * yielding on a singular or array of generator yields or promise resolution.
 *
 * @param {*} object Object to normalize.
 *
 * @return {AsyncGenerator} Async iterable actions.
 */
export function toAsyncIterable(object) {
	if (isAsyncIterable(object)) {
		return object;
	}

	return _asyncGenerator.wrap( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
		var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, maybeAction;

		return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
						_iterator2 = _getIterator(object);

					case 6:
						if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
							_context2.next = 16;
							break;
						}

						maybeAction = _step2.value;

						// ...of Promises.
						if (!(maybeAction instanceof _Promise)) {
							maybeAction = _Promise.resolve(maybeAction);
						}

						_context2.next = 11;
						return _asyncGenerator.await(maybeAction);

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

registerDataStore();