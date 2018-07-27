import _extends from "@babel/runtime/helpers/extends";
import "core-js/modules/web.dom.iterable";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { mapValues, reduce, forEach, noop } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
import { createHigherOrderComponent } from '@wordpress/compose';
import isShallowEqual from '@wordpress/is-shallow-equal';
/**
 * Internal dependencies
 */

import _request, { getCachedResponse } from './request';
import { getRoute } from './routes';
export default (function (mapPropsToData) {
  return createHigherOrderComponent(function (WrappedComponent) {
    var APIDataComponent =
    /*#__PURE__*/
    function (_Component) {
      _inherits(APIDataComponent, _Component);

      function APIDataComponent(props, context) {
        var _this;

        _classCallCheck(this, APIDataComponent);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(APIDataComponent).apply(this, arguments));
        _this.schema = context.getAPISchema();
        _this.routeHelpers = mapValues({
          type: context.getAPIPostTypeRestBaseMapping(),
          taxonomy: context.getAPITaxonomyRestBaseMapping()
        }, function (mapping) {
          return function (key) {
            return mapping[key];
          };
        });
        _this.state = {
          dataProps: _this.applyMapping(props)
        };
        _this.isStillMounted = true;
        return _this;
      }

      _createClass(APIDataComponent, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.initializeFetchable({});
        }
      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
          if (!isShallowEqual(prevProps, this.props)) {
            var dataProps = this.applyMapping(this.props, this.state.dataProps);
            this.setState({
              dataProps: dataProps
            });
          }

          this.initializeFetchable(prevState.dataProps);
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.isStillMounted = false;
        }
      }, {
        key: "initializeFetchable",
        value: function initializeFetchable(prevDataProps) {
          var _this2 = this;

          var dataProps = this.state.dataProps; // Trigger first fetch on initial entries into state. Assumes GET
          // request by presence of isLoading flag.

          forEach(dataProps, function (dataProp, propName) {
            if (prevDataProps.hasOwnProperty(propName) && prevDataProps[propName].path === dataProp.path) {
              return;
            } // Skip request is already assigned via cache


            if (dataProp[_this2.getResponseDataKey('GET')]) {
              return;
            }

            if (_this2.getPendingKey('GET') in dataProp) {
              dataProp[_this2.getRequestKey('GET')]();
            }
          });
        }
      }, {
        key: "setIntoDataProp",
        value: function setIntoDataProp(propName, values) {
          if (!this.isStillMounted) {
            return;
          }

          this.setState(function (prevState) {
            var dataProps = prevState.dataProps;
            return {
              dataProps: _objectSpread({}, dataProps, _defineProperty({}, propName, _objectSpread({}, dataProps[propName], values)))
            };
          });
        }
      }, {
        key: "getRequestKey",
        value: function getRequestKey(method) {
          switch (method) {
            case 'GET':
              return 'get';

            case 'POST':
              return 'create';

            case 'PUT':
              return 'save';

            case 'PATCH':
              return 'patch';

            case 'DELETE':
              return 'delete';
          }
        }
      }, {
        key: "getPendingKey",
        value: function getPendingKey(method) {
          switch (method) {
            case 'GET':
              return 'isLoading';

            case 'POST':
              return 'isCreating';

            case 'PUT':
              return 'isSaving';

            case 'PATCH':
              return 'isPatching';

            case 'DELETE':
              return 'isDeleting';
          }
        }
      }, {
        key: "getResponseDataKey",
        value: function getResponseDataKey(method) {
          switch (method) {
            case 'GET':
              return 'data';

            case 'POST':
              return 'createdData';

            case 'PUT':
              return 'savedData';

            case 'PATCH':
              return 'patchedData';

            case 'DELETE':
              return 'deletedData';
          }
        }
      }, {
        key: "getErrorResponseKey",
        value: function getErrorResponseKey(method) {
          switch (method) {
            case 'GET':
              return 'error';

            case 'POST':
              return 'createError';

            case 'PUT':
              return 'saveError';

            case 'PATCH':
              return 'patchError';

            case 'DELETE':
              return 'deleteError';
          }
        }
      }, {
        key: "request",
        value: function request(propName, method, path) {
          var _this3 = this;

          this.setIntoDataProp(propName, _defineProperty({}, this.getPendingKey(method), true));

          _request({
            path: path,
            method: method
          }) // [Success] Set the data prop:
          .then(function (response) {
            return _defineProperty({}, _this3.getResponseDataKey(method), response.body);
          }) // [Failure] Set the error prop:
          .catch(function (error) {
            return _defineProperty({}, _this3.getErrorResponseKey(method), error);
          }) // Always reset loading prop:
          .then(function (nextDataProp) {
            _this3.setIntoDataProp(propName, _objectSpread(_defineProperty({}, _this3.getPendingKey(method), false), nextDataProp));
          });
        }
      }, {
        key: "applyMapping",
        value: function applyMapping(props) {
          var _this4 = this;

          var previousDataProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var mapping = mapPropsToData(props, this.routeHelpers);
          var nextDataProps = reduce(mapping, function (result, path, propName) {
            // Skip if mapping already assigned into state data props
            // Example: Component updates with one new prop and other
            // previously existing; previously existing should not be
            // clobbered or re-trigger fetch
            var dataProp = previousDataProps[propName];

            if (dataProp && dataProp.path === path) {
              result[propName] = dataProp;
              return result;
            }

            result[propName] = {};
            var route = getRoute(_this4.schema, path);

            if (!route) {
              return result;
            }

            route.methods.forEach(function (method) {
              // Add request initiator into data props
              var requestKey = _this4.getRequestKey(method);

              result[propName][requestKey] = _this4.request.bind(_this4, propName, method, path); // Initialize pending flags as explicitly false

              var pendingKey = _this4.getPendingKey(method);

              result[propName][pendingKey] = false; // If cached data already exists, populate in result

              var cachedResponse = getCachedResponse({
                path: path,
                method: method
              });

              if (cachedResponse) {
                var dataKey = _this4.getResponseDataKey(method);

                result[propName][dataKey] = cachedResponse.body;
              } // Track path for future map skipping


              result[propName].path = path;
            });
            return result;
          }, {});
          return nextDataProps;
        }
      }, {
        key: "render",
        value: function render() {
          return createElement(WrappedComponent, _extends({}, this.props, this.state.dataProps));
        }
      }]);

      return APIDataComponent;
    }(Component);

    APIDataComponent.contextTypes = {
      getAPISchema: noop,
      getAPIPostTypeRestBaseMapping: noop,
      getAPITaxonomyRestBaseMapping: noop
    };
    return APIDataComponent;
  }, 'withAPIData');
});