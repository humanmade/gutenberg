"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime/core-js/object/define-property");

var _Object$keys = require("@babel/runtime/core-js/object/keys");

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  renderToString: true,
  RawHTML: true
};
Object.defineProperty(exports, "renderToString", {
  enumerable: true,
  get: function get() {
    return _serialize.default;
  }
});
Object.defineProperty(exports, "RawHTML", {
  enumerable: true,
  get: function get() {
    return _rawHtml.default;
  }
});

var _react = require("./react");

_Object$keys(_react).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _react[key];
    }
  });
});

var _reactPlatform = require("./react-platform");

_Object$keys(_reactPlatform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reactPlatform[key];
    }
  });
});

var _serialize = _interopRequireDefault(require("./serialize"));

var _rawHtml = _interopRequireDefault(require("./raw-html"));

var _deprecated = require("./deprecated");

_Object$keys(_deprecated).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _deprecated[key];
    }
  });
});