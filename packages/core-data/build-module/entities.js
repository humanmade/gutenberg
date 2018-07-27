import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _awaitAsyncGenerator from "@babel/runtime/helpers/awaitAsyncGenerator";
import _wrapAsyncGenerator from "@babel/runtime/helpers/wrapAsyncGenerator";

/**
 * External dependencies
 */
import { upperFirst, camelCase, map, find } from 'lodash';
/**
 * WordPress dependencies
 */

import apiFetch from '@wordpress/api-fetch';
/**
 * Internal dependencies
 */

import { getEntitiesByKind } from './selectors';
import { addEntities } from './actions';
export var defaultEntities = [{
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
export var kinds = [{
  name: 'postType',
  loadEntities: loadPostTypeEntities
}];
/**
 * Returns the list of post type entities.
 *
 * @return {Promise} Entities promise
 */

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
  _loadPostTypeEntities = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var postTypes;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return apiFetch({
              path: '/wp/v2/types?context=edit'
            });

          case 2:
            postTypes = _context2.sent;
            return _context2.abrupt("return", map(postTypes, function (postType, name) {
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

export var getMethodName = function getMethodName(kind, name) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
  var usePlural = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var entity = find(defaultEntities, {
    kind: kind,
    name: name
  });
  var kindPrefix = kind === 'root' ? '' : upperFirst(camelCase(kind));
  var nameSuffix = upperFirst(camelCase(name)) + (usePlural ? 's' : '');
  var suffix = usePlural && entity.plural ? upperFirst(camelCase(entity.plural)) : nameSuffix;
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

export function getKindEntities(_x, _x2) {
  return _getKindEntities.apply(this, arguments);
}

function _getKindEntities() {
  _getKindEntities = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(state, kind) {
    var entities, kindConfig;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            entities = getEntitiesByKind(state, kind);

            if (!(entities && entities.length !== 0)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", entities);

          case 3:
            kindConfig = find(kinds, {
              name: kind
            });

            if (kindConfig) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", []);

          case 6:
            _context.next = 8;
            return _awaitAsyncGenerator(kindConfig.loadEntities());

          case 8:
            entities = _context.sent;
            _context.next = 11;
            return addEntities(entities);

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