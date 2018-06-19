'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

	return next((0, _extends3.default)({}, options, {
		path: path
	}));
};

exports.default = namespaceAndEndpointMiddleware;