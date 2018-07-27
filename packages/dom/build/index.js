"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _Object$defineProperty = require("@babel/runtime/core-js/object/define-property");

var _Object$keys = require("@babel/runtime/core-js/object/keys");

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  focus: true
};
exports.focus = void 0;

var focusable = _interopRequireWildcard(require("./focusable"));

var tabbable = _interopRequireWildcard(require("./tabbable"));

var _dom = require("./dom");

_Object$keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dom[key];
    }
  });
});

/**
 * Internal dependencies
 */
var focus = {
  focusable: focusable,
  tabbable: tabbable
};
exports.focus = focus;