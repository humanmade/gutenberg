"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.array.find");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategories = getCategories;
exports.getAuthors = getAuthors;
exports.getEntityRecord = getEntityRecord;
exports.getEntityRecords = getEntityRecords;
exports.getThemeSupports = getThemeSupports;

var _values = _interopRequireDefault(require("@babel/runtime/core-js/object/values"));

require("core-js/modules/web.dom.iterable");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncIterator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncIterator"));

var _asyncGeneratorDelegate2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncGeneratorDelegate"));

var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));

var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));

var _lodash = require("lodash");

var _apiFetch = _interopRequireDefault(require("@wordpress/api-fetch"));

var _actions = require("./actions");

var _entities = require("./entities");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */

/**
 * Requests categories from the REST API, yielding action objects on request
 * progress.
 */
function getCategories() {
  return _getCategories.apply(this, arguments);
}
/**
 * Requests authors from the REST API.
 */


function _getCategories() {
  _getCategories = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var categories;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _awaitAsyncGenerator2.default)((0, _apiFetch.default)({
              path: '/wp/v2/categories?per_page=-1'
            }));

          case 2:
            categories = _context.sent;
            _context.next = 5;
            return (0, _actions.receiveTerms)('categories', categories);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getCategories.apply(this, arguments);
}

function getAuthors() {
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
  _getAuthors = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var users;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _awaitAsyncGenerator2.default)((0, _apiFetch.default)({
              path: '/wp/v2/users/?who=authors&per_page=-1'
            }));

          case 2:
            users = _context2.sent;
            _context2.next = 5;
            return (0, _actions.receiveUserQuery)('authors', users);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getAuthors.apply(this, arguments);
}

function getEntityRecord(_x, _x2, _x3, _x4) {
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
  _getEntityRecord = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(state, kind, name, key) {
    var entities, entity, record;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = _asyncGeneratorDelegate2.default;
            _context3.t1 = _asyncIterator2.default;
            _context3.next = 4;
            return (0, _awaitAsyncGenerator2.default)((0, _entities.getKindEntities)(state, kind));

          case 4:
            _context3.t2 = _context3.sent;
            _context3.t3 = (0, _context3.t1)(_context3.t2);
            _context3.t4 = _awaitAsyncGenerator2.default;
            return _context3.delegateYield((0, _context3.t0)(_context3.t3, _context3.t4), "t5", 8);

          case 8:
            entities = _context3.t5;
            entity = (0, _lodash.find)(entities, {
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
            return (0, _awaitAsyncGenerator2.default)((0, _apiFetch.default)({
              path: "".concat(entity.baseURL, "/").concat(key, "?context=edit")
            }));

          case 14:
            record = _context3.sent;
            _context3.next = 17;
            return (0, _actions.receiveEntityRecords)(kind, name, record);

          case 17:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _getEntityRecord.apply(this, arguments);
}

function getEntityRecords(_x5, _x6, _x7) {
  return _getEntityRecords.apply(this, arguments);
}
/**
 * Requests theme supports data from the index.
 */


function _getEntityRecords() {
  _getEntityRecords = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(state, kind, name) {
    var entities, entity, records;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = _asyncGeneratorDelegate2.default;
            _context4.t1 = _asyncIterator2.default;
            _context4.next = 4;
            return (0, _awaitAsyncGenerator2.default)((0, _entities.getKindEntities)(state, kind));

          case 4:
            _context4.t2 = _context4.sent;
            _context4.t3 = (0, _context4.t1)(_context4.t2);
            _context4.t4 = _awaitAsyncGenerator2.default;
            return _context4.delegateYield((0, _context4.t0)(_context4.t3, _context4.t4), "t5", 8);

          case 8:
            entities = _context4.t5;
            entity = (0, _lodash.find)(entities, {
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
            return (0, _awaitAsyncGenerator2.default)((0, _apiFetch.default)({
              path: "".concat(entity.baseURL, "?context=edit")
            }));

          case 14:
            records = _context4.sent;
            _context4.next = 17;
            return (0, _actions.receiveEntityRecords)(kind, name, (0, _values.default)(records));

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _getEntityRecords.apply(this, arguments);
}

function getThemeSupports() {
  return _getThemeSupports.apply(this, arguments);
}

function _getThemeSupports() {
  _getThemeSupports = (0, _wrapAsyncGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var index;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _awaitAsyncGenerator2.default)((0, _apiFetch.default)({
              path: '/'
            }));

          case 2:
            index = _context5.sent;
            _context5.next = 5;
            return (0, _actions.receiveThemeSupportsFromIndex)(index);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _getThemeSupports.apply(this, arguments);
}