import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { TouchableOpacity, Text, View } from 'react-native';
export default function Button(props) {
  var children = props.children,
      onClick = props.onClick,
      ariaLabel = props['aria-label'],
      ariaPressed = props['aria-pressed'],
      subscript = props['data-subscript'];
  return createElement(TouchableOpacity, {
    accessible: true,
    accessibilityLabel: ariaLabel,
    onPress: onClick,
    style: {
      borderColor: ariaPressed ? 'black' : 'white',
      borderWidth: 1,
      borderRadius: 2
    }
  }, createElement(View, {
    style: {
      height: 44,
      width: 44,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }, children, subscript && createElement(Text, {
    style: {
      fontVariant: ['small-caps']
    }
  }, subscript)));
}
//# sourceMappingURL=index.native.js.map