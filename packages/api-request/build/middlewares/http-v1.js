'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function httpV1Middleware(options, next) {
	var newOptions = (0, _extends3.default)({}, options);
	if (newOptions.method) {
		if (['PATCH', 'PUT', 'DELETE'].indexOf(newOptions.method.toUpperCase()) >= 0) {
			if (!newOptions.headers) {
				newOptions.headers = {};
			}
			newOptions.headers['X-HTTP-Method-Override'] = newOptions.method;
			newOptions.method = 'POST';

			newOptions.contentType = 'application/json';
			newOptions.data = (0, _stringify2.default)(newOptions.data);
		}
	}

	return next(newOptions, next);
}

exports.default = httpV1Middleware;