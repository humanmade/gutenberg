"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.array.find");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKindEntities = getKindEntities;
exports.getMethodName = exports.kinds = exports.defaultEntities = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _lodash = require("lodash");

var _apiFetch = _interopRequireDefault(require("@wordpress/api-fetch"));

var _selectors = require("./selectors");

var _actions = require("./actions");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
var defaultEntities = [{
  name: 'postType',
  kind: 'root',
  key: 'slug',
  baseURL: '/wp/v2/types'
}, {
  name: 'media',
  kind: 'root',
  baseURL: '/wp/v2/media',
  plural: 'mediaItems'
}, {
  name: 'taxonomy',
  kind: 'root',
  key: 'slug',
  baseURL: '/wp/v2/taxonomies',
  plural: 'taxonomies'
}];
exports.defaultEntities = defaultEntities;
var kinds = [{
  name: 'postType',
  loadEntities: loadPostTypeEntities
}];
/**
 * Returns the list of post type entities.
 *
 * @return {Promise} Entities promise
 */

exports.kinds = kinds;

function loadPostTypeEntities() {
  return _loadPostTypeEntities.apply(this, arguments);
}
/**
 * Returns the entity's getter method name given its kind and name.
 *
 * @param {string}  kind      Entity kind.
 * @param {string}  name      Entity name.
 * @param {string}  prefix    Function prefix.
 * @param {boolean} usePlural Whether to use the plural form or not.
 *
 * @return {string} Method name
 */


function _loadPostTypeEntities() {
  _loadPostTypeEntities = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var postTypes;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _apiFetch.default)({
              path: '/wp/v2/types?context=edit'
            });

          case 2:
            postTypes = _context2.sent;
            return _context2.abrupt("return", (0, _lodash.map)(postTypes, function (postType, name) {
              return {
                kind: 'postType',
                baseURL: '/wp/v2/' + postType.rest_base,
                name: name
              };
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _loadPostTypeEntities.apply(this, arguments);
}

var getMethodName = function getMethodName(kind, name) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
  var usePlural = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var entity = (0, _lodash.find)(defaultEntities, {
    kind: kind,
    name: name
  });
  var kindPrefix = kind === 'root' ? '' : (0, _lodash.upperFirst)((0, _lodash.camelCase)(kind));
  var nameSuffix = (0, _lodash.upperFirst)((0, _lodash.camelCase)(name)) + (usePlural ? 's' : '');
  var suffix = usePlural && entity.plural ? (0, _lodash.upperFirst)((0, _lodash.camelCase)(entity.plural)) : nameSuffix;
  return "".concat(prefix).concat(kindPrefix).concat(suffix);
};
/**
 * Loads the kind entities into the store.
 *
 * @param {Object} state Global state
 * @param {string} kind  Kind
 *
 * @return {Array} Entities
 */


exports.getMethodName = getMethodName;

function getKindEntities(_x, _x2) {
  return _getKindEntities.apply(this, arguments);
}

function _getKindEntities() {
  _getKindEntities = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(state, kind) {
    var entities, kindConfig;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            entities = (0, _selectors.getEntitiesByKind)(state, kind);

            if (!(entities && entities.length !== 0)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", entities);

          case 3:
            kindConfig = (0, _lodash.find)(kinds, {
              name: kind
            });

            if (kindConfig) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", []);

          case 6:
            _context.next = 8;
            return (0, _awaitAsyncGenerator2.default)(kindConfig.loadEntities());

          case 8:
            entities = _context.sent;
            _context.next = 11;
            return (0, _actions.addEntities)(entities);

          case 11:
            return _context.abrupt("return", entities);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getKindEntities.apply(this, arguments);
}