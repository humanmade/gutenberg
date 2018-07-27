import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * External dependencies.
 */
import { isEqual } from 'lodash';
/**
 * WordPress dependencies.
 */

import { Component, RawHTML } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import httpBuildQuery from 'http-build-query';
/**
 * Internal dependencies.
 */

import Placeholder from '../placeholder';
import Spinner from '../spinner';
export function rendererPathWithAttributes(block) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  return "/gutenberg/v1/block-renderer/".concat(block, "?context=edit") + (null !== attributes ? '&' + httpBuildQuery({
    attributes: attributes
  }) : '');
}
export var ServerSideRender =
/*#__PURE__*/
function (_Component) {
  _inherits(ServerSideRender, _Component);

  function ServerSideRender(props) {
    var _this;

    _classCallCheck(this, ServerSideRender);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ServerSideRender).call(this, props));
    _this.state = {
      response: null
    };
    return _this;
  }

  _createClass(ServerSideRender, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.isStillMounted = true;
      this.fetch(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.isStillMounted = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (!isEqual(prevProps, this.props)) {
        this.fetch(this.props);
      }
    }
  }, {
    key: "fetch",
    value: function fetch(props) {
      var _this2 = this;

      if (null !== this.state.response) {
        this.setState({
          response: null
        });
      }

      var block = props.block,
          _props$attributes = props.attributes,
          attributes = _props$attributes === void 0 ? null : _props$attributes;
      var path = rendererPathWithAttributes(block, attributes);
      return apiFetch({
        path: path
      }).then(function (response) {
        if (_this2.isStillMounted && response && response.rendered) {
          _this2.setState({
            response: response.rendered
          });
        }
      }).catch(function (error) {
        if (_this2.isStillMounted) {
          _this2.setState({
            response: {
              error: true,
              errorMsg: error.message
            }
          });
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      var response = this.state.response;

      if (!response) {
        return createElement(Placeholder, null, createElement(Spinner, null));
      } else if (response.error) {
        // translators: %s: error message describing the problem
        var errorMessage = sprintf(__('Error loading block: %s'), response.errorMsg);
        return createElement(Placeholder, null, errorMessage);
      } else if (!response.length) {
        return createElement(Placeholder, null, __('No results found.'));
      }

      return createElement(RawHTML, {
        key: "html"
      }, response);
    }
  }]);

  return ServerSideRender;
}(Component);
export default ServerSideRender;