'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThemeSupports = exports.getEntityRecords = exports.getEntityRecord = exports.getAuthors = exports.getCategories = undefined;

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _asyncIterator2 = require('babel-runtime/helpers/asyncIterator');

var _asyncIterator3 = _interopRequireDefault(_asyncIterator2);

var _asyncGeneratorDelegate2 = require('babel-runtime/helpers/asyncGeneratorDelegate');

var _asyncGeneratorDelegate3 = _interopRequireDefault(_asyncGeneratorDelegate2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

/**
 * Requests categories from the REST API, yielding action objects on request
 * progress.
 */


/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
var getCategories = exports.getCategories = function () {
  var _ref = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var categories;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _asyncGenerator3.default.await((0, _apiRequest2.default)({ path: '/wp/v2/categories?per_page=-1' }));

          case 2:
            categories = _context.sent;
            _context.next = 5;
            return (0, _actions.receiveTerms)('categories', categories);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getCategories() {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Requests authors from the REST API.
 */


/**
 * WordPress dependencies
 */


var getAuthors = exports.getAuthors = function () {
  var _ref2 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var users;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _asyncGenerator3.default.await((0, _apiRequest2.default)({ path: '/wp/v2/users/?who=authors&per_page=-1' }));

          case 2:
            users = _context2.sent;
            _context2.next = 5;
            return (0, _actions.receiveUserQuery)('authors', users);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getAuthors() {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Requests an entity's record from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 * @param {number} key    Record's key
 */


var getEntityRecord = exports.getEntityRecord = function () {
  var _ref3 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee3(state, kind, name, key) {
    var entities, entity, record;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = _asyncGeneratorDelegate3.default;
            _context3.t1 = _asyncIterator3.default;
            _context3.next = 4;
            return _asyncGenerator3.default.await((0, _entities.getKindEntities)(state, kind));

          case 4:
            _context3.t2 = _context3.sent;
            _context3.t3 = (0, _context3.t1)(_context3.t2);
            _context3.t4 = _asyncGenerator3.default.await;
            return _context3.delegateYield((0, _context3.t0)(_context3.t3, _context3.t4), 't5', 8);

          case 8:
            entities = _context3.t5;
            entity = (0, _lodash.find)(entities, { kind: kind, name: name });

            if (entity) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt('return');

          case 12:
            _context3.next = 14;
            return _asyncGenerator3.default.await((0, _apiRequest2.default)({ path: entity.baseUrl + '/' + key + '?context=edit' }));

          case 14:
            record = _context3.sent;
            _context3.next = 17;
            return (0, _actions.receiveEntityRecords)(kind, name, record);

          case 17:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getEntityRecord(_x, _x2, _x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Requests the entity's records from the REST API.
 *
 * @param {Object} state  State tree
 * @param {string} kind   Entity kind.
 * @param {string} name   Entity name.
 */


var getEntityRecords = exports.getEntityRecords = function () {
  var _ref4 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee4(state, kind, name) {
    var entities, entity, records;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = _asyncGeneratorDelegate3.default;
            _context4.t1 = _asyncIterator3.default;
            _context4.next = 4;
            return _asyncGenerator3.default.await((0, _entities.getKindEntities)(state, kind));

          case 4:
            _context4.t2 = _context4.sent;
            _context4.t3 = (0, _context4.t1)(_context4.t2);
            _context4.t4 = _asyncGenerator3.default.await;
            return _context4.delegateYield((0, _context4.t0)(_context4.t3, _context4.t4), 't5', 8);

          case 8:
            entities = _context4.t5;
            entity = (0, _lodash.find)(entities, { kind: kind, name: name });

            if (entity) {
              _context4.next = 12;
              break;
            }

            return _context4.abrupt('return');

          case 12:
            _context4.next = 14;
            return _asyncGenerator3.default.await((0, _apiRequest2.default)({ path: entity.baseUrl + '?context=edit' }));

          case 14:
            records = _context4.sent;
            _context4.next = 17;
            return (0, _actions.receiveEntityRecords)(kind, name, (0, _values2.default)(records));

          case 17:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function getEntityRecords(_x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Requests theme supports data from the index.
 */


var getThemeSupports = exports.getThemeSupports = function () {
  var _ref5 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var index;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _asyncGenerator3.default.await((0, _apiRequest2.default)({ path: '/' }));

          case 2:
            index = _context5.sent;
            _context5.next = 5;
            return (0, _actions.receiveThemeSupportsFromIndex)(index);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function getThemeSupports() {
    return _ref5.apply(this, arguments);
  };
}();

var _lodash = require('lodash');

var _apiRequest = require('@wordpress/api-request');

var _apiRequest2 = _interopRequireDefault(_apiRequest);

var _actions = require('./actions');

var _entities = require('./entities');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }