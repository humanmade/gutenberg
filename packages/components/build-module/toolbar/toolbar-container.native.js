import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { View } from 'react-native';
export default (function (props) {
  return createElement(View, {
    style: {
      flexDirection: 'row'
    }
  }, props.children);
});
//# sourceMappingURL=toolbar-container.native.js.map