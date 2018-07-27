import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { Component, renderToString, createRef } from '@wordpress/element';
import { withGlobalEvents } from '@wordpress/compose';
/**
 * Internal dependencies
 */

import FocusableIframe from '../focusable-iframe';

var Sandbox =
/*#__PURE__*/
function (_Component) {
  _inherits(Sandbox, _Component);

  function Sandbox() {
    var _this;

    _classCallCheck(this, Sandbox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sandbox).apply(this, arguments));
    _this.trySandbox = _this.trySandbox.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.checkMessageForResize = _this.checkMessageForResize.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.iframe = createRef();
    _this.state = {
      width: 0,
      height: 0
    };
    return _this;
  }

  _createClass(Sandbox, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.trySandbox();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.trySandbox();
    }
  }, {
    key: "isFrameAccessible",
    value: function isFrameAccessible() {
      try {
        return !!this.iframe.current.contentDocument.body;
      } catch (e) {
        return false;
      }
    }
  }, {
    key: "checkMessageForResize",
    value: function checkMessageForResize(event) {
      var iframe = this.iframe.current; // Attempt to parse the message data as JSON if passed as string

      var data = event.data || {};

      if ('string' === typeof data) {
        try {
          data = JSON.parse(data);
        } catch (e) {} // eslint-disable-line no-empty

      } // Verify that the mounted element is the source of the message


      if (!iframe || iframe.contentWindow !== event.source) {
        return;
      } // Update the state only if the message is formatted as we expect, i.e.
      // as an object with a 'resize' action, width, and height


      var _data = data,
          action = _data.action,
          width = _data.width,
          height = _data.height;
      var _this$state = this.state,
          oldWidth = _this$state.width,
          oldHeight = _this$state.height;

      if ('resize' === action && (oldWidth !== width || oldHeight !== height)) {
        this.setState({
          width: width,
          height: height
        });
      }
    }
  }, {
    key: "trySandbox",
    value: function trySandbox() {
      if (!this.isFrameAccessible()) {
        return;
      }

      var body = this.iframe.current.contentDocument.body;

      if (null !== body.getAttribute('data-resizable-iframe-connected')) {
        return;
      }

      var observeAndResizeJS = "\n\t\t\t( function() {\n\t\t\t\tvar observer;\n\t\t\t\tvar aspectRatio = false;\n\t\t\t\tvar iframe = false;\n\n\t\t\t\tif ( ! window.MutationObserver || ! document.body || ! window.parent ) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tfunction sendResize() {\n\t\t\t\t\tvar clientBoundingRect = document.body.getBoundingClientRect();\n\t\t\t\t\tvar height = aspectRatio ? Math.ceil( clientBoundingRect.width / aspectRatio ) : clientBoundingRect.height;\n\n\t\t\t\t\tif ( iframe && aspectRatio ) {\n\t\t\t\t\t\t// This is embedded content delivered in an iframe with a fixed aspect ratio,\n\t\t\t\t\t\t// so set the height correctly and stop processing. The DOM mutation will trigger\n\t\t\t\t\t\t// another event and the resize message will get posted.\n\t\t\t\t\t\tif ( iframe.height != height ) {\n\t\t\t\t\t\t\tiframe.height = height;\n\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\twindow.parent.postMessage( {\n\t\t\t\t\t\taction: 'resize',\n\t\t\t\t\t\twidth: clientBoundingRect.width,\n\t\t\t\t\t\theight: height,\n\t\t\t\t\t}, '*' );\n\t\t\t\t}\n\n\t\t\t\tobserver = new MutationObserver( sendResize );\n\t\t\t\tobserver.observe( document.body, {\n\t\t\t\t\tattributes: true,\n\t\t\t\t\tattributeOldValue: false,\n\t\t\t\t\tcharacterData: true,\n\t\t\t\t\tcharacterDataOldValue: false,\n\t\t\t\t\tchildList: true,\n\t\t\t\t\tsubtree: true\n\t\t\t\t} );\n\n\t\t\t\twindow.addEventListener( 'load', sendResize, true );\n\n\t\t\t\t// Hack: Remove viewport unit styles, as these are relative\n\t\t\t\t// the iframe root and interfere with our mechanism for\n\t\t\t\t// determining the unconstrained page bounds.\n\t\t\t\tfunction removeViewportStyles( ruleOrNode ) {\n\t\t\t\t\t[ 'width', 'height', 'minHeight', 'maxHeight' ].forEach( function( style ) {\n\t\t\t\t\t\tif ( /^\\d+(vmin|vmax|vh|vw)$/.test( ruleOrNode.style[ style ] ) ) {\n\t\t\t\t\t\t\truleOrNode.style[ style ] = '';\n\t\t\t\t\t\t}\n\t\t\t\t\t} );\n\t\t\t\t}\n\n\t\t\t\tArray.prototype.forEach.call( document.querySelectorAll( '[style]' ), removeViewportStyles );\n\t\t\t\tArray.prototype.forEach.call( document.styleSheets, function( stylesheet ) {\n\t\t\t\t\tArray.prototype.forEach.call( stylesheet.cssRules || stylesheet.rules, removeViewportStyles );\n\t\t\t\t} );\n\n\t\t\t\tdocument.body.style.position = 'absolute';\n\t\t\t\tdocument.body.style.width = '100%';\n\t\t\t\tdocument.body.setAttribute( 'data-resizable-iframe-connected', '' );\n\n\t\t\t\t// Make embedded content in an iframe with a fixed size responsive,\n\t\t\t\t// keeping the correct aspect ratio.\n\t\t\t\tvar potentialIframe = document.body.children[0];\n\t\t\t\tif ( 'DIV' === potentialIframe.tagName || 'SPAN' === potentialIframe.tagName ) {\n\t\t\t\t\t\tpotentialIframe = potentialIframe.children[0];\n\t\t\t\t\t}\n\t\t\t\tif ( 'IFRAME' === potentialIframe.tagName ) {\n\t\t\t\t\tif ( potentialIframe.width ) {\n\t\t\t\t\t\tiframe = potentialIframe;\n\t\t\t\t\t\taspectRatio = potentialIframe.width / potentialIframe.height;\n\t\t\t\t\t\tpotentialIframe.width = '100%';\n\t\t\t\t\t}\n\t\t\t\t}\n\n\t\t\t\tsendResize();\n\n\t\t\t\t// Resize events can change the width of elements with 100% width, but we don't\n\t\t\t\t// get an DOM mutations for that, so do the resize when the window is resized, too.\n\t\t\t\twindow.addEventListener( 'resize', sendResize, true );\n\t\t} )();";
      var style = "\n\t\t\tbody {\n\t\t\t\tmargin: 0;\n\t\t\t}\n\t\t\tbody > div > iframe {\n\t\t\t\twidth: 100%;\n\t\t\t}\n\t\t\tbody > div > * {\n\t\t\t\tmargin-top: 0 !important;\t/* has to have !important to override inline styles */\n\t\t\t\tmargin-bottom: 0 !important;\n\t\t\t}\n\t\t"; // put the html snippet into a html document, and then write it to the iframe's document
      // we can use this in the future to inject custom styles or scripts

      var htmlDoc = createElement("html", {
        lang: document.documentElement.lang
      }, createElement("head", null, createElement("title", null, this.props.title), createElement("style", {
        dangerouslySetInnerHTML: {
          __html: style
        }
      })), createElement("body", {
        "data-resizable-iframe-connected": "data-resizable-iframe-connected",
        className: this.props.type
      }, createElement("div", {
        dangerouslySetInnerHTML: {
          __html: this.props.html
        }
      }), createElement("script", {
        type: "text/javascript",
        dangerouslySetInnerHTML: {
          __html: observeAndResizeJS
        }
      }))); // writing the document like this makes it act in the same way as if it was
      // loaded over the network, so DOM creation and mutation, script execution, etc.
      // all work as expected

      var iframeDocument = this.iframe.current.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write('<!DOCTYPE html>' + renderToString(htmlDoc));
      iframeDocument.close();
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.props.title;
      return createElement(FocusableIframe, {
        iframeRef: this.iframe,
        title: title,
        scrolling: "no",
        sandbox: "allow-scripts allow-same-origin allow-presentation",
        onLoad: this.trySandbox,
        width: Math.ceil(this.state.width),
        height: Math.ceil(this.state.height)
      });
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        html: '',
        title: ''
      };
    }
  }]);

  return Sandbox;
}(Component);

Sandbox = withGlobalEvents({
  message: 'checkMessageForResize'
})(Sandbox);
export default Sandbox;