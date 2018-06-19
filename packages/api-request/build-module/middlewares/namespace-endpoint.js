import _extends from 'babel-runtime/helpers/extends';
var namespaceAndEndpointMiddleware = function namespaceAndEndpointMiddleware(options, next) {
	var path = options.path;
	var namespaceTrimmed = void 0,
	    endpointTrimmed = void 0;

	if (typeof options.namespace === 'string' && typeof options.endpoint === 'string') {
		namespaceTrimmed = options.namespace.replace(/^\/|\/$/g, '');
		endpointTrimmed = options.endpoint.replace(/^\//, '');
		if (endpointTrimmed) {
			path = namespaceTrimmed + '/' + endpointTrimmed;
		} else {
			path = namespaceTrimmed;
		}
	}

	delete options.namespace;
	delete options.endpoint;

	return next(_extends({}, options, {
		path: path
	}));
};

export default namespaceAndEndpointMiddleware;