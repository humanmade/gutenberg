import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { Component, RawHTML } from '@wordpress/element';
/**
 * Internal dependencies
 */

import { serialize } from '../api';
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
  _inherits(BlockContentProvider, _Component);

  function BlockContentProvider() {
    _classCallCheck(this, BlockContentProvider);

    return _possibleConstructorReturn(this, _getPrototypeOf(BlockContentProvider).apply(this, arguments));
  }

  _createClass(BlockContentProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      var innerBlocks = this.props.innerBlocks;
      return {
        BlockContent: function BlockContent() {
          // Value is an array of blocks, so defer to block serializer
          var html = serialize(innerBlocks); // Use special-cased raw HTML tag to avoid default escaping

          return createElement(RawHTML, null, html);
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
}(Component);

BlockContentProvider.childContextTypes = {
  BlockContent: function BlockContent() {}
};
export default BlockContentProvider;