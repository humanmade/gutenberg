'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getKindEntities = exports.getMethodName = exports.kinds = exports.defaultEntities = undefined;

var _asyncGenerator2 = require('babel-runtime/helpers/asyncGenerator');

var _asyncGenerator3 = _interopRequireDefault(_asyncGenerator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

/**
 * Returns the list of post type entities.
 *
 * @return {Promise} Entities promise
 */
var loadPostTypeEntities = function () {
	var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
		var postTypes;
		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.next = 2;
						return (0, _apiRequest2.default)({ path: '/wp/v2/types?context=edit' });

					case 2:
						postTypes = _context.sent;
						return _context.abrupt('return', (0, _lodash.map)(postTypes, function (postType, name) {
							return {
								kind: 'postType',
								baseUrl: '/wp/v2/' + postType.rest_base,
								name: name
							};
						}));

					case 4:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this);
	}));

	return function loadPostTypeEntities() {
		return _ref.apply(this, arguments);
	};
}();

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


/**
 * Loads the kind entities into the store.
 *
 * @param {Object} state Global state
 * @param {string} kind  Kind
 *
 * @return {Array} Entities
 */
var getKindEntities = exports.getKindEntities = function () {
	var _ref2 = _asyncGenerator3.default.wrap( /*#__PURE__*/_regenerator2.default.mark(function _callee2(state, kind) {
		var entities, kindConfig;
		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						entities = (0, _selectors.getEntitiesByKind)(state, kind);

						if (!(entities && entities.length !== 0)) {
							_context2.next = 3;
							break;
						}

						return _context2.abrupt('return', entities);

					case 3:
						kindConfig = (0, _lodash.find)(kinds, { name: kind });

						if (kindConfig) {
							_context2.next = 6;
							break;
						}

						return _context2.abrupt('return', []);

					case 6:
						_context2.next = 8;
						return _asyncGenerator3.default.await(kindConfig.loadEntities());

					case 8:
						entities = _context2.sent;
						_context2.next = 11;
						return (0, _actions.addEntities)(entities);

					case 11:
						return _context2.abrupt('return', entities);

					case 12:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));

	return function getKindEntities(_x3, _x4) {
		return _ref2.apply(this, arguments);
	};
}();

var _lodash = require('lodash');

var _apiRequest = require('@wordpress/api-request');

var _apiRequest2 = _interopRequireDefault(_apiRequest);

var _selectors = require('./selectors');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
var defaultEntities = exports.defaultEntities = [{ name: 'postType', kind: 'root', key: 'slug', baseUrl: '/wp/v2/types' }, { name: 'media', kind: 'root', baseUrl: '/wp/v2/media', plural: 'mediaItems' }, { name: 'taxonomy', kind: 'root', key: 'slug', baseUrl: '/wp/v2/taxonomies', plural: 'taxonomies' }];

/**
 * WordPress dependencies
 */
var kinds = exports.kinds = [{ name: 'postType', loadEntities: loadPostTypeEntities }];var getMethodName = exports.getMethodName = function getMethodName(kind, name) {
	var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'get';
	var usePlural = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

	var entity = (0, _lodash.find)(defaultEntities, { kind: kind, name: name });
	var kindPrefix = kind === 'root' ? '' : (0, _lodash.upperFirst)((0, _lodash.camelCase)(kind));
	var nameSuffix = (0, _lodash.upperFirst)((0, _lodash.camelCase)(name)) + (usePlural ? 's' : '');
	var suffix = usePlural && entity.plural ? (0, _lodash.upperFirst)((0, _lodash.camelCase)(entity.plural)) : nameSuffix;
	return '' + prefix + kindPrefix + suffix;
};