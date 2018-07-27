import _Object$values from "@babel/runtime/core-js/object/values";
import "core-js/modules/web.dom.iterable";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import "regenerator-runtime/runtime";
import _asyncIterator from "@babel/runtime/helpers/asyncIterator";
import _asyncGeneratorDelegate from "@babel/runtime/helpers/asyncGeneratorDelegate";
import _awaitAsyncGenerator from "@babel/runtime/helpers/awaitAsyncGenerator";
import _wrapAsyncGenerator from "@babel/runtime/helpers/wrapAsyncGenerator";

/**
 * External dependencies
 */
import { find } from 'lodash';
/**
 * WordPress dependencies
 */

import apiFetch from '@wordpress/api-fetch';
/**
 * Internal dependencies
 */

import { receiveTerms, receiveUserQuery, receiveEntityRecords, receiveThemeSupportsFromIndex } from './actions';
import { getKindEntities } from './entities';
/**
 * Requests categories from the REST API, yielding action objects on request
 * progress.
 */

export function getCategories() {
  return _getCategories.apply(this, arguments);
}
/**
 * Requests authors from the REST API.
 */

function _getCategories() {
  _getCategories = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var categories;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _awaitAsyncGenerator(apiFetch({
              path: '/wp/v2/categories?per_page=-1'
            }));

          case 2:
            categories = _context.sent;
            _context.next = 5;
            return receiveTerms('categories', categories);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getCategories.apply(this, arguments);
}

export function getAuthors() {
  return _getAuthors.apply(this, arguments);
}
/**
 * Requests an entity's record from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 * @param {number} key    Record's key
 */

function _getAuthors() {
  _getAuthors = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var users;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _awaitAsyncGenerator(apiFetch({
              path: '/wp/v2/users/?who=authors&per_page=-1'
            }));

          case 2:
            users = _context2.sent;
            _context2.next = 5;
            return receiveUserQuery('authors', users);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getAuthors.apply(this, arguments);
}

export function getEntityRecord(_x, _x2, _x3, _x4) {
  return _getEntityRecord.apply(this, arguments);
}
/**
 * Requests the entity's records from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 */

function _getEntityRecord() {
  _getEntityRecord = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3(state, kind, name, key) {
    var entities, entity, record;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = _asyncGeneratorDelegate;
            _context3.t1 = _asyncIterator;
            _context3.next = 4;
            return _awaitAsyncGenerator(getKindEntities(state, kind));

          case 4:
            _context3.t2 = _context3.sent;
            _context3.t3 = (0, _context3.t1)(_context3.t2);
            _context3.t4 = _awaitAsyncGenerator;
            return _context3.delegateYield((0, _context3.t0)(_context3.t3, _context3.t4), "t5", 8);

          case 8:
            entities = _context3.t5;
            entity = find(entities, {
              kind: kind,
              name: name
            });

            if (entity) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return");

          case 12:
            _context3.next = 14;
            return _awaitAsyncGenerator(apiFetch({
              path: "".concat(entity.baseURL, "/").concat(key, "?context=edit")
            }));

          case 14:
            record = _context3.sent;
            _context3.next = 17;
            return receiveEntityRecords(kind, name, record);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _getEntityRecord.apply(this, arguments);
}

export function getEntityRecords(_x5, _x6, _x7) {
  return _getEntityRecords.apply(this, arguments);
}
/**
 * Requests theme supports data from the index.
 */

function _getEntityRecords() {
  _getEntityRecords = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee4(state, kind, name) {
    var entities, entity, records;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = _asyncGeneratorDelegate;
            _context4.t1 = _asyncIterator;
            _context4.next = 4;
            return _awaitAsyncGenerator(getKindEntities(state, kind));

          case 4:
            _context4.t2 = _context4.sent;
            _context4.t3 = (0, _context4.t1)(_context4.t2);
            _context4.t4 = _awaitAsyncGenerator;
            return _context4.delegateYield((0, _context4.t0)(_context4.t3, _context4.t4), "t5", 8);

          case 8:
            entities = _context4.t5;
            entity = find(entities, {
              kind: kind,
              name: name
            });

            if (entity) {
              _context4.next = 12;
              break;
            }

            return _context4.abrupt("return");

          case 12:
            _context4.next = 14;
            return _awaitAsyncGenerator(apiFetch({
              path: "".concat(entity.baseURL, "?context=edit")
            }));

          case 14:
            records = _context4.sent;
            _context4.next = 17;
            return receiveEntityRecords(kind, name, _Object$values(records));

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _getEntityRecords.apply(this, arguments);
}

export function getThemeSupports() {
  return _getThemeSupports.apply(this, arguments);
}

function _getThemeSupports() {
  _getThemeSupports = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee5() {
    var index;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _awaitAsyncGenerator(apiFetch({
              path: '/'
            }));

          case 2:
            index = _context5.sent;
            _context5.next = 5;
            return receiveThemeSupportsFromIndex(index);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _getThemeSupports.apply(this, arguments);
}