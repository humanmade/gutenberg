'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pure = exports.compose = exports.renderToString = exports.createPortal = exports.isValidElement = exports.createContext = exports.Fragment = exports.StrictMode = exports.Children = exports.findDOMNode = exports.cloneElement = exports.Component = exports.unmountComponentAtNode = exports.render = exports.forwardRef = exports.createRef = exports.createElement = undefined;

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

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.concatChildren = concatChildren;
exports.switchChildrenNodeName = switchChildrenNodeName;
exports.createHigherOrderComponent = createHigherOrderComponent;
exports.RawHTML = RawHTML;

var _react = require('react');

var _reactDom = require('react-dom');

var _lodash = require('lodash');

var _isShallowEqual = require('@wordpress/is-shallow-equal');

var _isShallowEqual2 = _interopRequireDefault(_isShallowEqual);

var _serialize = require('./serialize');

var _serialize2 = _interopRequireDefault(_serialize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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


/**
 * WordPress dependencies
 */
exports.createElement = _react.createElement;

/**
 * Returns an object tracking a reference to a rendered element via its
 * `current` property as either a DOMElement or Element, dependent upon the
 * type of element rendered with the ref attribute.
 *
 * @return {Object} Ref object.
 */


/**
 * Internal dependencies
 */
/**
 * External dependencies
 */

exports.createRef = _react.createRef;

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

exports.forwardRef = _react.forwardRef;

/**
 * Renders a given element into the target DOM node.
 *
 * @param {WPElement} element Element to render
 * @param {Element}   target  DOM node into which element should be rendered
 */

exports.render = _reactDom.render;

/**
 * Removes any mounted element from the target DOM node.
 *
 * @param {Element} target DOM node in which element is to be removed
 */

exports.unmountComponentAtNode = _reactDom.unmountComponentAtNode;

/**
 * A base class to create WordPress Components (Refs, state and lifecycle hooks)
 */

exports.Component = _react.Component;

/**
 * Creates a copy of an element with extended props.
 *
 * @param {WPElement} element Element
 * @param {?Object}   props   Props to apply to cloned element
 *
 * @return {WPElement} Cloned element.
 */

exports.cloneElement = _react.cloneElement;

/**
 * Finds the dom node of a React component
 *
 * @param {Component} component component's instance
 * @param {Element}   target    DOM node into which element should be rendered
 */

exports.findDOMNode = _reactDom.findDOMNode;
exports.Children = _react.Children;
exports.StrictMode = _react.StrictMode;

/**
 * A component which renders its children without any wrapping element.
 */

exports.Fragment = _react.Fragment;

/**
 * Creates a context object containing two components: a provider and consumer.
 *
 * @param {Object} defaultValue A default data stored in the context.
 *
 * @return {Object} Context object.
 */

exports.createContext = _react.createContext;

/**
 * Checks if an object is a valid WPElement
 *
 * @param {Object} objectToCheck The object to be checked.
 *
 * @return {boolean} true if objectToTest is a valid WPElement and false otherwise.
 */

exports.isValidElement = _react.isValidElement;

/**
 * Creates a portal into which a component can be rendered.
 *
 * @see https://github.com/facebook/react/issues/10309#issuecomment-318433235
 *
 * @param {Component} component Component
 * @param {Element}   target    DOM node into which element should be rendered
 */

exports.createPortal = _reactDom.createPortal;

/**
 * Renders a given element into a string.
 *
 * @param {WPElement} element Element to render
 *
 * @return {string} HTML.
 */

exports.renderToString = _serialize2.default;

/**
 * Concatenate two or more React children objects.
 *
 * @param {...?Object} childrenArguments Array of children arguments (array of arrays/strings/objects) to concatenate.
 *
 * @return {Array} The concatenated value.
 */

function concatChildren() {
  for (var _len = arguments.length, childrenArguments = Array(_len), _key = 0; _key < _len; _key++) {
    childrenArguments[_key] = arguments[_key];
  }

  return childrenArguments.reduce(function (memo, children, i) {
    _react.Children.forEach(children, function (child, j) {
      if (child && 'string' !== typeof child) {
        child = (0, _react.cloneElement)(child, {
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
function switchChildrenNodeName(children, nodeName) {
  return children && _react.Children.map(children, function (elt, index) {
    if ((0, _lodash.isString)(elt)) {
      return (0, _react.createElement)(nodeName, { key: index }, elt);
    }
    var _elt$props = elt.props,
        childrenProp = _elt$props.children,
        props = (0, _objectWithoutProperties3.default)(_elt$props, ['children']);

    return (0, _react.createElement)(nodeName, (0, _extends3.default)({ key: index }, props), childrenProp);
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
exports.compose = _lodash.flowRight;

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

function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName) {
  return function (OriginalComponent) {
    var EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    var _OriginalComponent$di = OriginalComponent.displayName,
        displayName = _OriginalComponent$di === undefined ? OriginalComponent.name || 'Component' : _OriginalComponent$di;

    EnhancedComponent.displayName = (0, _lodash.upperFirst)((0, _lodash.camelCase)(modifierName)) + '(' + displayName + ')';

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
function RawHTML(_ref) {
  var children = _ref.children,
      props = (0, _objectWithoutProperties3.default)(_ref, ['children']);

  // The DIV wrapper will be stripped by serializer, unless there are
  // non-children props present.
  return (0, _react.createElement)('div', (0, _extends3.default)({
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
var pure = exports.pure = createHigherOrderComponent(function (Wrapped) {
  if (Wrapped.prototype instanceof _react.Component) {
    return function (_Wrapped) {
      (0, _inherits3.default)(_class, _Wrapped);

      function _class() {
        (0, _classCallCheck3.default)(this, _class);
        return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).apply(this, arguments));
      }

      (0, _createClass3.default)(_class, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          return !(0, _isShallowEqual2.default)(nextProps, this.props) || !(0, _isShallowEqual2.default)(nextState, this.state);
        }
      }]);
      return _class;
    }(Wrapped);
  }

  return function (_Component) {
    (0, _inherits3.default)(_class2, _Component);

    function _class2() {
      (0, _classCallCheck3.default)(this, _class2);
      return (0, _possibleConstructorReturn3.default)(this, (_class2.__proto__ || (0, _getPrototypeOf2.default)(_class2)).apply(this, arguments));
    }

    (0, _createClass3.default)(_class2, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate(nextProps) {
        return !(0, _isShallowEqual2.default)(nextProps, this.props);
      }
    }, {
      key: 'render',
      value: function render() {
        return (0, _react.createElement)(Wrapped, this.props);
      }
    }]);
    return _class2;
  }(_react.Component);
}, 'pure');