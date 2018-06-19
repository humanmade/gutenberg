'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _nonce = require('./middlewares/nonce');

var _nonce2 = _interopRequireDefault(_nonce);

var _rootUrl = require('./middlewares/root-url');

var _rootUrl2 = _interopRequireDefault(_rootUrl);

var _preloading = require('./middlewares/preloading');

var _preloading2 = _interopRequireDefault(_preloading);

var _namespaceEndpoint = require('./middlewares/namespace-endpoint');

var _namespaceEndpoint2 = _interopRequireDefault(_namespaceEndpoint);

var _httpV = require('./middlewares/http-v1');

var _httpV2 = _interopRequireDefault(_httpV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * External dependencies
 */
var middlewares = [];

/**
 * Internal dependencies
 */


function registerMiddleware(middleware) {
	middlewares.push(middleware);
}

function apiRequest(options) {
	var raw = function raw(nextOptions) {
		return _jquery2.default.ajax(nextOptions);
	};
	var steps = [].concat(middlewares, [_namespaceEndpoint2.default, _httpV2.default, raw]).reverse();
	var next = function next(nextOptions) {
		var nextMiddleware = steps.pop();
		return nextMiddleware(nextOptions, next);
	};

	return next(options);
}

apiRequest.use = registerMiddleware;

apiRequest.createNonceMiddleware = _nonce2.default;
apiRequest.createPreloadingMiddleware = _preloading2.default;
apiRequest.createRootURLMiddleware = _rootUrl2.default;

exports.default = apiRequest;