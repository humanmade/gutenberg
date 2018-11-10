"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _isShallowEqual = _interopRequireDefault(require("@wordpress/is-shallow-equal"));

var _compose = require("@wordpress/compose");

var _registryProvider = require("../registry-provider");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Higher-order component used to inject state-derived props using registered
 * selectors.
 *
 * @param {Function} mapSelectToProps Function called on every state change,
 *                                   expected to return object of props to
 *                                   merge with the component's own props.
 *
 * @return {Component} Enhanced component with merged state data props.
 */
var withSelect = function withSelect(mapSelectToProps) {
  return (0, _compose.createHigherOrderComponent)(function (WrappedComponent) {
    /**
     * Default merge props. A constant value is used as the fallback since it
     * can be more efficiently shallow compared in case component is repeatedly
    	 * rendered without its own merge props.
     *
     * @type {Object}
     */
    var DEFAULT_MERGE_PROPS = {};
    /**
     * Given a props object, returns the next merge props by mapSelectToProps.
     *
     * @param {Object} props Props to pass as argument to mapSelectToProps.
     *
     * @return {Object} Props to merge into rendered wrapped element.
     */

    function getNextMergeProps(props) {
      return mapSelectToProps(props.registry.select, props.ownProps) || DEFAULT_MERGE_PROPS;
    }

    var ComponentWithSelect =
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(ComponentWithSelect, _Component);

      function ComponentWithSelect(props) {
        var _this;

        (0, _classCallCheck2.default)(this, ComponentWithSelect);
        _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ComponentWithSelect).call(this, props));

        _this.subscribe(props.registry);

        _this.mergeProps = getNextMergeProps(props);
        return _this;
      }

      (0, _createClass2.default)(ComponentWithSelect, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.canRunSelection = true;
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.canRunSelection = false;
          this.unsubscribe();
        }
      }, {
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps, nextState) {
          // Cycle subscription if registry changes.
          var hasRegistryChanged = nextProps.registry !== this.props.registry;

          if (hasRegistryChanged) {
            this.unsubscribe();
            this.subscribe(nextProps.registry);
          } // Treat a registry change as equivalent to `ownProps`, to reflect
          // `mergeProps` to rendered component if and only if updated.


          var hasPropsChanged = hasRegistryChanged || !(0, _isShallowEqual.default)(this.props.ownProps, nextProps.ownProps); // Only render if props have changed or merge props have been updated
          // from the store subscriber.

          if (this.state === nextState && !hasPropsChanged) {
            return false;
          }

          if (hasPropsChanged) {
            var nextMergeProps = getNextMergeProps(nextProps);

            if (!(0, _isShallowEqual.default)(this.mergeProps, nextMergeProps)) {
              // If merge props change as a result of the incoming props,
              // they should be reflected as such in the upcoming render.
              // While side effects are discouraged in lifecycle methods,
              // this component is used heavily, and prior efforts to use
              // `getDerivedStateFromProps` had demonstrated miserable
              // performance.
              this.mergeProps = nextMergeProps;
            } // Regardless whether merge props are changing, fall through to
            // incur the render since the component will need to receive
            // the changed `ownProps`.

          }

          return true;
        }
      }, {
        key: "subscribe",
        value: function subscribe(registry) {
          var _this2 = this;

          this.unsubscribe = registry.subscribe(function () {
            if (!_this2.canRunSelection) {
              return;
            }

            var nextMergeProps = getNextMergeProps(_this2.props);

            if ((0, _isShallowEqual.default)(_this2.mergeProps, nextMergeProps)) {
              return;
            }

            _this2.mergeProps = nextMergeProps; // Schedule an update. Merge props are not assigned to state
            // because derivation of merge props from incoming props occurs
            // within shouldComponentUpdate, where setState is not allowed.
            // setState is used here instead of forceUpdate because forceUpdate
            // bypasses shouldComponentUpdate altogether, which isn't desireable
            // if both state and props change within the same render.
            // Unfortunately this requires that next merge props are generated
            // twice.

            _this2.setState({});
          });
        }
      }, {
        key: "render",
        value: function render() {
          return (0, _element.createElement)(WrappedComponent, (0, _extends2.default)({}, this.props.ownProps, this.mergeProps));
        }
      }]);
      return ComponentWithSelect;
    }(_element.Component);

    return function (ownProps) {
      return (0, _element.createElement)(_registryProvider.RegistryConsumer, null, function (registry) {
        return (0, _element.createElement)(ComponentWithSelect, {
          ownProps: ownProps,
          registry: registry
        });
      });
    };
  }, 'withSelect');
};

var _default = withSelect;
exports.default = _default;
//# sourceMappingURL=index.js.map