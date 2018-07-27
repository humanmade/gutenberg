"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _api = require("../api");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

/**
 * An internal block component used in block content serialization to inject
 * nested block content within the `save` implementation of the ancestor
 * component in which it is nested. The component provides a pre-bound
 * `BlockContent` component via context, which is used by the developer-facing
 * `InnerBlocks.Content` component to render block content.
 *
 * @example
 *
 * ```jsx
 * <BlockContentProvider innerBlocks={ innerBlocks }>
 * 	{ blockSaveElement }
 * </BlockContentProvider>
 * ```
 */
var BlockContentProvider =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(BlockContentProvider, _Component);

  function BlockContentProvider() {
    (0, _classCallCheck2.default)(this, BlockContentProvider);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BlockContentProvider).apply(this, arguments));
  }

  (0, _createClass2.default)(BlockContentProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      var innerBlocks = this.props.innerBlocks;
      return {
        BlockContent: function BlockContent() {
          // Value is an array of blocks, so defer to block serializer
          var html = (0, _api.serialize)(innerBlocks); // Use special-cased raw HTML tag to avoid default escaping

          return (0, _element.createElement)(_element.RawHTML, null, html);
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);
  return BlockContentProvider;
}(_element.Component);

BlockContentProvider.childContextTypes = {
  BlockContent: function BlockContent() {}
};
var _default = BlockContentProvider;
exports.default = _default;