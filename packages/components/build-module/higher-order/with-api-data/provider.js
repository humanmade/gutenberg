import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/**
 * External dependencies
 */
import { mapValues, noop } from 'lodash';
/**
 * WordPress dependencies
 */

import { Component } from '@wordpress/element';
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

export var unstable__setApiSettings = function unstable__setApiSettings(schema, postTypeRestBaseMapping, taxonomyRestBaseMapping) {
  apiSettings = {
    schema: schema,
    postTypeRestBaseMapping: postTypeRestBaseMapping,
    taxonomyRestBaseMapping: taxonomyRestBaseMapping
  };
};

var APIProvider =
/*#__PURE__*/
function (_Component) {
  _inherits(APIProvider, _Component);

  function APIProvider() {
    _classCallCheck(this, APIProvider);

    return _possibleConstructorReturn(this, _getPrototypeOf(APIProvider).apply(this, arguments));
  }

  _createClass(APIProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return mapValues({
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
}(Component);

export { APIProvider as default };
APIProvider.childContextTypes = {
  getAPISchema: noop,
  getAPIPostTypeRestBaseMapping: noop,
  getAPITaxonomyRestBaseMapping: noop
};