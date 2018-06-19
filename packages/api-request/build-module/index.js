/**
 * External dependencies
 */
import jQuery from 'jquery';

/**
 * Internal dependencies
 */
import createNonceMiddleware from './middlewares/nonce';
import createRootURLMiddleware from './middlewares/root-url';
import createPreloadingMiddleware from './middlewares/preloading';
import namespaceEndpointMiddleware from './middlewares/namespace-endpoint';
import httpV1Middleware from './middlewares/http-v1';

var middlewares = [];

function registerMiddleware(middleware) {
	middlewares.push(middleware);
}

function apiRequest(options) {
	var raw = function raw(nextOptions) {
		return jQuery.ajax(nextOptions);
	};
	var steps = [].concat(middlewares, [namespaceEndpointMiddleware, httpV1Middleware, raw]).reverse();
	var next = function next(nextOptions) {
		var nextMiddleware = steps.pop();
		return nextMiddleware(nextOptions, next);
	};

	return next(options);
}

apiRequest.use = registerMiddleware;

apiRequest.createNonceMiddleware = createNonceMiddleware;
apiRequest.createPreloadingMiddleware = createPreloadingMiddleware;
apiRequest.createRootURLMiddleware = createRootURLMiddleware;

export default apiRequest;