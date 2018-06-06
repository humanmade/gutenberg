import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
/**
 * External dependencies
 */
import { createElement, createContext, createRef, forwardRef, Component, cloneElement, Children, Fragment } from 'react';
import { render, findDOMNode, createPortal, unmountComponentAtNode } from 'react-dom';
import { camelCase, flowRight, isString, upperFirst } from 'lodash';

/**
 * WordPress dependencies
 */
import isShallowEqual from '@wordpress/is-shallow-equal';

/**
 * Internal dependencies
 */
import serialize from './serialize';

/**
 * Returns a new element of given type. Type can be either a string tag name or
 * another function which itself returns an element.
 *
 * @param {?(string|Function)} type     Tag name or element creator
 * @param {Object}             props    Element properties, either attribute
 *                                       set to apply to DOM node or values to
 *                                       pass through to element creator
 * @param {...WPElement}       children Descendant elements
 *
 * @return {WPElement} Element.
 */
export { createElement };

/**
 * Returns an object tracking a reference to a rendered element via its
 * `current` property as either a DOMElement or Element, dependent upon the
 * type of element rendered with the ref attribute.
 *
 * @return {Object} Ref object.
 */
export { createRef };

/**
 * Component enhancer used to enable passing a ref to its wrapped component.
 * Pass a function argument which receives `props` and `ref` as its arguments,
 * returning an element using the forwarded ref. The return value is a new
 * component which forwards its ref.
 *
 * @param {Function} forwarder Function passed `props` and `ref`, expected to
 *                             return an element.
 *
 * @return {WPComponent} Enhanced component.
 */
export { forwardRef };

/**
 * Renders a given element into the target DOM node.
 *
 * @param {WPElement} element Element to render
 * @param {Element}   target  DOM node into which element should be rendered
 */
export { render };

/**
 * Removes any mounted element from the target DOM node.
 *
 * @param {Element} target DOM node in which element is to be removed
 */
export { unmountComponentAtNode };

/**
 * A base class to create WordPress Components (Refs, state and lifecycle hooks)
 */
export { Component };

/**
 * Creates a copy of an element with extended props.
 *
 * @param {WPElement} element Element
 * @param {?Object}   props   Props to apply to cloned element
 *
 * @return {WPElement} Cloned element.
 */
export { cloneElement };

/**
 * Finds the dom node of a React component
 *
 * @param {Component} component component's instance
 * @param {Element}   target    DOM node into which element should be rendered
 */
export { findDOMNode };

export { Children };

/**
 * A component which renders its children without any wrapping element.
 */
export { Fragment };

/**
 * Creates a context object containing two components: a provider and consumer.
 *
 * @param {Object} defaultValue A default data stored in the context.
 *
 * @return {Object} Context object.
 */
export { createContext };

/**
 * Creates a portal into which a component can be rendered.
 *
 * @see https://github.com/facebook/react/issues/10309#issuecomment-318433235
 *
 * @param {Component} component Component
 * @param {Element}   target    DOM node into which element should be rendered
 */
export { createPortal };

/**
 * Renders a given element into a string.
 *
 * @param {WPElement} element Element to render
 *
 * @return {string} HTML.
 */
export { serialize as renderToString };

/**
 * Concatenate two or more React children objects.
 *
 * @param {...?Object} childrenArguments Array of children arguments (array of arrays/strings/objects) to concatenate.
 *
 * @return {Array} The concatenated value.
 */
export function concatChildren() {
  for (var _len = arguments.length, childrenArguments = Array(_len), _key = 0; _key < _len; _key++) {
    childrenArguments[_key] = arguments[_key];
  }

  return childrenArguments.reduce(function (memo, children, i) {
    Children.forEach(children, function (child, j) {
      if (child && 'string' !== typeof child) {
        child = cloneElement(child, {
          key: [i, j].join()
        });
      }

      memo.push(child);
    });

    return memo;
  }, []);
}

/**
 * Switches the nodeName of all the elements in the children object.
 *
 * @param {?Object} children Children object.
 * @param {string}  nodeName Node name.
 *
 * @return {?Object} The updated children object.
 */
export function switchChildrenNodeName(children, nodeName) {
  return children && Children.map(children, function (elt, index) {
    if (isString(elt)) {
      return createElement(nodeName, { key: index }, elt);
    }

    var _elt$props = elt.props,
        childrenProp = _elt$props.children,
        props = _objectWithoutProperties(_elt$props, ['children']);

    return createElement(nodeName, _extends({ key: index }, props), childrenProp);
  });
}

/**
 * Composes multiple higher-order components into a single higher-order component. Performs right-to-left function
 * composition, where each successive invocation is supplied the return value of the previous.
 *
 * @param {...Function} hocs The HOC functions to invoke.
 *
 * @return {Function} Returns the new composite function.
 */
export { flowRight as compose };

/**
 * Given a function mapping a component to an enhanced component and modifier
 * name, returns the enhanced component augmented with a generated displayName.
 *
 * @param {Function} mapComponentToEnhancedComponent Function mapping component
 *                                                   to enhanced component.
 * @param {string}   modifierName                    Seed name from which to
 *                                                   generated display name.
 *
 * @return {WPComponent} Component class with generated display name assigned.
 */
export function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName) {
  return function (OriginalComponent) {
    var EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    var _OriginalComponent$di = OriginalComponent.displayName,
        displayName = _OriginalComponent$di === undefined ? OriginalComponent.name || 'Component' : _OriginalComponent$di;

    EnhancedComponent.displayName = upperFirst(camelCase(modifierName)) + '(' + displayName + ')';

    return EnhancedComponent;
  };
}

/**
 * Component used as equivalent of Fragment with unescaped HTML, in cases where
 * it is desirable to render dangerous HTML without needing a wrapper element.
 * To preserve additional props, a `div` wrapper _will_ be created if any props
 * aside from `children` are passed.
 *
 * @param {string} props.children HTML to render.
 *
 * @return {WPElement} Dangerously-rendering element.
 */
export function RawHTML(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  // The DIV wrapper will be stripped by serializer, unless there are
  // non-children props present.
  return createElement('div', _extends({
    dangerouslySetInnerHTML: { __html: children }
  }, props));
}

/**
 * Given a component returns the enhanced component augmented with a component
 * only rerendering when its props/state change
 *
 * @param {Function} mapComponentToEnhancedComponent Function mapping component
 *                                                   to enhanced component.
 * @param {string}   modifierName                    Seed name from which to
 *                                                   generated display name.
 *
 * @return {WPComponent} Component class with generated display name assigned.
 */
export var pure = createHigherOrderComponent(function (Wrapped) {
  if (Wrapped.prototype instanceof Component) {
    return function (_Wrapped) {
      _inherits(_class, _Wrapped);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, (_class.__proto__ || _Object$getPrototypeOf(_class)).apply(this, arguments));
      }

      _createClass(_class, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !isShallowEqual(nextProps, this.props) || !isShallowEqual(nextState, this.state);
        }
      }]);

      return _class;
    }(Wrapped);
  }

  return function (_Component) {
    _inherits(_class2, _Component);

    function _class2() {
      _classCallCheck(this, _class2);

      return _possibleConstructorReturn(this, (_class2.__proto__ || _Object$getPrototypeOf(_class2)).apply(this, arguments));
    }

    _createClass(_class2, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !isShallowEqual(nextProps, this.props);
      }
    }, {
      key: 'render',
      value: function render() {
        return createElement(Wrapped, this.props);
      }
    }]);

    return _class2;
  }(Component);
}, 'pure');