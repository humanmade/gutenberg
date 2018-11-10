import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { noop } from 'lodash';
import classnames from 'classnames';
/**
 * WordPress dependencies
 */

import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, getColorClassName } from '@wordpress/editor';
import { createBlock } from '@wordpress/blocks';
/**
 * Internal dependencies
 */

import edit from './edit';
var DEFAULT_MEDIA_WIDTH = 50;
export var name = 'core/media-text';
export var settings = {
  title: __('Media & Text'),
  description: __('Set media and words side-by-side media for a richer layout.'),
  icon: createElement(SVG, {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24"
  }, createElement(Path, {
    d: "M13 17h8v-2h-8v2zM3 19h8V5H3v14zM13 9h8V7h-8v2zm0 4h8v-2h-8v2z"
  })),
  category: 'layout',
  keywords: [__('image'), __('video')],
  attributes: {
    align: {
      type: 'string',
      default: 'wide'
    },
    backgroundColor: {
      type: 'string'
    },
    customBackgroundColor: {
      type: 'string'
    },
    mediaAlt: {
      type: 'string',
      source: 'attribute',
      selector: 'figure img',
      attribute: 'alt',
      default: ''
    },
    mediaPosition: {
      type: 'string',
      default: 'left'
    },
    mediaId: {
      type: 'number'
    },
    mediaUrl: {
      type: 'string',
      source: 'attribute',
      selector: 'figure video,figure img',
      attribute: 'src'
    },
    mediaType: {
      type: 'string'
    },
    mediaWidth: {
      type: 'number',
      default: 50
    },
    isStackedOnMobile: {
      type: 'boolean',
      default: false
    }
  },
  supports: {
    align: ['wide', 'full']
  },
  transforms: {
    from: [{
      type: 'block',
      blocks: ['core/image'],
      transform: function transform(_ref) {
        var alt = _ref.alt,
            url = _ref.url,
            id = _ref.id;
        return createBlock('core/media-text', {
          mediaAlt: alt,
          mediaId: id,
          mediaUrl: url,
          mediaType: 'image'
        });
      }
    }, {
      type: 'block',
      blocks: ['core/video'],
      transform: function transform(_ref2) {
        var src = _ref2.src,
            id = _ref2.id;
        return createBlock('core/media-text', {
          mediaId: id,
          mediaUrl: src,
          mediaType: 'video'
        });
      }
    }],
    to: [{
      type: 'block',
      blocks: ['core/image'],
      isMatch: function isMatch(_ref3) {
        var mediaType = _ref3.mediaType,
            mediaUrl = _ref3.mediaUrl;
        return !mediaUrl || mediaType === 'image';
      },
      transform: function transform(_ref4) {
        var mediaAlt = _ref4.mediaAlt,
            mediaId = _ref4.mediaId,
            mediaUrl = _ref4.mediaUrl;
        return createBlock('core/image', {
          alt: mediaAlt,
          id: mediaId,
          url: mediaUrl
        });
      }
    }, {
      type: 'block',
      blocks: ['core/video'],
      isMatch: function isMatch(_ref5) {
        var mediaType = _ref5.mediaType,
            mediaUrl = _ref5.mediaUrl;
        return !mediaUrl || mediaType === 'video';
      },
      transform: function transform(_ref6) {
        var mediaId = _ref6.mediaId,
            mediaUrl = _ref6.mediaUrl;
        return createBlock('core/video', {
          id: mediaId,
          src: mediaUrl
        });
      }
    }]
  },
  edit: edit,
  save: function save(_ref7) {
    var _classnames;

    var attributes = _ref7.attributes;
    var backgroundColor = attributes.backgroundColor,
        customBackgroundColor = attributes.customBackgroundColor,
        isStackedOnMobile = attributes.isStackedOnMobile,
        mediaAlt = attributes.mediaAlt,
        mediaPosition = attributes.mediaPosition,
        mediaType = attributes.mediaType,
        mediaUrl = attributes.mediaUrl,
        mediaWidth = attributes.mediaWidth;
    var mediaTypeRenders = {
      image: function image() {
        return createElement("img", {
          src: mediaUrl,
          alt: mediaAlt
        });
      },
      video: function video() {
        return createElement("video", {
          controls: true,
          src: mediaUrl
        });
      }
    };
    var backgroundClass = getColorClassName('background-color', backgroundColor);
    var className = classnames((_classnames = {
      'has-media-on-the-right': 'right' === mediaPosition
    }, _defineProperty(_classnames, backgroundClass, backgroundClass), _defineProperty(_classnames, 'is-stacked-on-mobile', isStackedOnMobile), _classnames));
    var gridTemplateColumns;

    if (mediaWidth !== DEFAULT_MEDIA_WIDTH) {
      gridTemplateColumns = 'right' === mediaPosition ? "auto ".concat(mediaWidth, "%") : "".concat(mediaWidth, "% auto");
    }

    var style = {
      backgroundColor: backgroundClass ? undefined : customBackgroundColor,
      gridTemplateColumns: gridTemplateColumns
    };
    return createElement("div", {
      className: className,
      style: style
    }, createElement("figure", {
      className: "wp-block-media-text__media"
    }, (mediaTypeRenders[mediaType] || noop)()), createElement("div", {
      className: "wp-block-media-text__content"
    }, createElement(InnerBlocks.Content, null)));
  }
};
//# sourceMappingURL=index.js.map