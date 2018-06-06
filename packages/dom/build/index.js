'use strict';

import _Object$defineProperty from 'babel-runtime/core-js/object/define-property';
import _Object$keys from 'babel-runtime/core-js/object/keys';
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focus = undefined;

var _dom = require('./dom');

_Object$keys(_dom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;

  _Object$defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _dom[key];
    }
  });
});

var _focusable = require('./focusable');

var focusable = _interopRequireWildcard(_focusable);

var _tabbable = require('./tabbable');

var tabbable = _interopRequireWildcard(_tabbable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Internal dependencies
 */
var focus = exports.focus = { focusable: focusable, tabbable: tabbable };