"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("core-js/modules/web.dom.iterable");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread4 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _compose = require("@wordpress/compose");

var _isShallowEqual = _interopRequireDefault(require("@wordpress/is-shallow-equal"));

var _request2 = _interopRequireWildcard(require("./request"));

var _routes = require("./routes");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
var _default = function _default(mapPropsToData) {
  return (0, _compose.createHigherOrderComponent)(function (WrappedComponent) {
    var APIDataComponent =
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(APIDataComponent, _Component);

      function APIDataComponent(props, context) {
        var _this;

        (0, _classCallCheck2.default)(this, APIDataComponent);
        _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(APIDataComponent).apply(this, arguments));
        _this.schema = context.getAPISchema();
        _this.routeHelpers = (0, _lodash.mapValues)({
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

      (0, _createClass2.default)(APIDataComponent, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          this.initializeFetchable({});
        }
      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
          if (!(0, _isShallowEqual.default)(prevProps, this.props)) {
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

          (0, _lodash.forEach)(dataProps, function (dataProp, propName) {
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
              dataProps: (0, _objectSpread4.default)({}, dataProps, (0, _defineProperty2.default)({}, propName, (0, _objectSpread4.default)({}, dataProps[propName], values)))
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

          this.setIntoDataProp(propName, (0, _defineProperty2.default)({}, this.getPendingKey(method), true));
          (0, _request2.default)({
            path: path,
            method: method
          }) // [Success] Set the data prop:
          .then(function (response) {
            return (0, _defineProperty2.default)({}, _this3.getResponseDataKey(method), response.body);
          }) // [Failure] Set the error prop:
          .catch(function (error) {
            return (0, _defineProperty2.default)({}, _this3.getErrorResponseKey(method), error);
          }) // Always reset loading prop:
          .then(function (nextDataProp) {
            _this3.setIntoDataProp(propName, (0, _objectSpread4.default)((0, _defineProperty2.default)({}, _this3.getPendingKey(method), false), nextDataProp));
          });
        }
      }, {
        key: "applyMapping",
        value: function applyMapping(props) {
          var _this4 = this;

          var previousDataProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
          var mapping = mapPropsToData(props, this.routeHelpers);
          var nextDataProps = (0, _lodash.reduce)(mapping, function (result, path, propName) {
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
            var route = (0, _routes.getRoute)(_this4.schema, path);

            if (!route) {
              return result;
            }

            route.methods.forEach(function (method) {
              // Add request initiator into data props
              var requestKey = _this4.getRequestKey(method);

              result[propName][requestKey] = _this4.request.bind(_this4, propName, method, path); // Initialize pending flags as explicitly false

              var pendingKey = _this4.getPendingKey(method);

              result[propName][pendingKey] = false; // If cached data already exists, populate in result

              var cachedResponse = (0, _request2.getCachedResponse)({
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
          return (0, _element.createElement)(WrappedComponent, (0, _extends2.default)({}, this.props, this.state.dataProps));
        }
      }]);
      return APIDataComponent;
    }(_element.Component);

    APIDataComponent.contextTypes = {
      getAPISchema: _lodash.noop,
      getAPIPostTypeRestBaseMapping: _lodash.noop,
      getAPITaxonomyRestBaseMapping: _lodash.noop
    };
    return APIDataComponent;
  }, 'withAPIData');
};

exports.default = _default;