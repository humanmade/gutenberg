import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import isShallowEqual from '@wordpress/is-shallow-equal';
import { remountOnPropChange, createHigherOrderComponent } from '@wordpress/compose';
/**
 * Internal dependencies
 */

import { RegistryConsumer } from '../registry-provider';
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

var withSelect = function withSelect(mapStateToProps) {
  return createHigherOrderComponent(function (WrappedComponent) {
    /**
     * Default merge props. A constant value is used as the fallback since it
     * can be more efficiently shallow compared in case component is repeatedly
    	 * rendered without its own merge props.
     *
     * @type {Object}
     */
    var DEFAULT_MERGE_PROPS = {};
    /**
     * Given a props object, returns the next merge props by mapStateToProps.
     *
     * @param {Object} props Props to pass as argument to mapStateToProps.
     *
     * @return {Object} Props to merge into rendered wrapped element.
     */

    function getNextMergeProps(props) {
      return mapStateToProps(props.registry.select, props.ownProps) || DEFAULT_MERGE_PROPS;
    }

    var ComponentWithSelect = remountOnPropChange('registry')(
    /*#__PURE__*/
    function (_Component) {
      _inherits(_class, _Component);

      function _class(props) {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));

        _this.subscribe();

        _this.mergeProps = getNextMergeProps(props);
        return _this;
      }

      _createClass(_class, [{
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
          var hasPropsChanged = !isShallowEqual(this.props.ownProps, nextProps.ownProps); // Only render if props have changed or merge props have been updated
          // from the store subscriber.

          if (this.state === nextState && !hasPropsChanged) {
            return false;
          } // If merge props change as a result of the incoming props, they
          // should be reflected as such in the upcoming render.


          if (hasPropsChanged) {
            var nextMergeProps = getNextMergeProps(nextProps);

            if (!isShallowEqual(this.mergeProps, nextMergeProps)) {
              // Side effects are typically discouraged in lifecycle methods, but
              // this component is heavily used and this is the most performant
              // code we've found thus far.
              // Prior efforts to use `getDerivedStateFromProps` have demonstrated
              // miserable performance.
              this.mergeProps = nextMergeProps;
            }
          }

          return true;
        }
      }, {
        key: "subscribe",
        value: function subscribe() {
          var _this2 = this;

          var subscribe = this.props.registry.subscribe;
          this.unsubscribe = subscribe(function () {
            if (!_this2.canRunSelection) {
              return;
            }

            var nextMergeProps = getNextMergeProps(_this2.props);

            if (isShallowEqual(_this2.mergeProps, nextMergeProps)) {
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
          return createElement(WrappedComponent, _extends({}, this.props.ownProps, this.mergeProps));
        }
      }]);

      return _class;
    }(Component));
    return function (ownProps) {
      return createElement(RegistryConsumer, null, function (registry) {
        return createElement(ComponentWithSelect, {
          ownProps: ownProps,
          registry: registry
        });
      });
    };
  }, 'withSelect');
};

export default withSelect;