"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.unstable__setApiSettings = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _lodash = require("lodash");

var _element = require("@wordpress/element");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Module constants
 */
var apiSettings = {};
/**
 * Do not use this API, it's only here while we deprecated withAPIData.
 *
 * @param {Object} schema
 * @param {Object} postTypeRestBaseMapping
 * @param {Object} taxonomyRestBaseMapping
 */
// eslint-disable-next-line camelcase

var unstable__setApiSettings = function unstable__setApiSettings(schema, postTypeRestBaseMapping, taxonomyRestBaseMapping) {
  apiSettings = {
    schema: schema,
    postTypeRestBaseMapping: postTypeRestBaseMapping,
    taxonomyRestBaseMapping: taxonomyRestBaseMapping
  };
};

exports.unstable__setApiSettings = unstable__setApiSettings;

var APIProvider =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(APIProvider, _Component);

  function APIProvider() {
    (0, _classCallCheck2.default)(this, APIProvider);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(APIProvider).apply(this, arguments));
  }

  (0, _createClass2.default)(APIProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return (0, _lodash.mapValues)({
        getAPISchema: 'schema',
        getAPIPostTypeRestBaseMapping: 'postTypeRestBaseMapping',
        getAPITaxonomyRestBaseMapping: 'taxonomyRestBaseMapping'
      }, function (key) {
        return function () {
          return apiSettings[key];
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return APIProvider;
}(_element.Component);

exports.default = APIProvider;
APIProvider.childContextTypes = {
  getAPISchema: _lodash.noop,
  getAPIPostTypeRestBaseMapping: _lodash.noop,
  getAPITaxonomyRestBaseMapping: _lodash.noop
};