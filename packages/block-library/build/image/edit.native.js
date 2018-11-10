"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ImageEdit;

var _element = require("@wordpress/element");

var _reactNative = require("react-native");

var _reactNativeGutenbergBridge = _interopRequireDefault(require("react-native-gutenberg-bridge"));

var _editor = require("@wordpress/editor");

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
function ImageEdit(props) {
  var attributes = props.attributes,
      isSelected = props.isSelected,
      setAttributes = props.setAttributes;
  var url = attributes.url,
      caption = attributes.caption;

  var onUploadPress = function onUploadPress() {// This method should present an image picker from
    // the device.
    //TODO: Implement upload image method.
  };

  var onMediaLibraryPress = function onMediaLibraryPress() {
    // Call onMediaLibraryPress from the Native<->RN bridge. It should trigger an image picker from
    // the WordPress media library and call the provided callback to set the image URL.
    _reactNativeGutenbergBridge.default.onMediaLibraryPress(function (mediaUrl) {
      if (mediaUrl) {
        setAttributes({
          url: mediaUrl
        });
      }
    });
  };

  if (!url) {
    return (0, _element.createElement)(_editor.MediaPlaceholder, {
      onUploadPress: onUploadPress,
      onMediaLibraryPress: onMediaLibraryPress
    });
  }

  return (0, _element.createElement)(_reactNative.View, {
    style: {
      flex: 1
    }
  }, (0, _element.createElement)(_reactNative.Image, {
    style: {
      width: '100%',
      height: 200
    },
    resizeMethod: "scale",
    source: {
      uri: url
    }
  }), (!_editor.RichText.isEmpty(caption) > 0 || isSelected) && (0, _element.createElement)(_reactNative.View, {
    style: {
      padding: 12,
      flex: 1
    }
  }, (0, _element.createElement)(_reactNative.TextInput, {
    style: {
      textAlign: 'center'
    },
    underlineColorAndroid: "transparent",
    value: caption,
    placeholder: 'Write caption…',
    onChangeText: function onChangeText(newCaption) {
      return setAttributes({
        caption: newCaption
      });
    }
  })));
}
//# sourceMappingURL=edit.native.js.map