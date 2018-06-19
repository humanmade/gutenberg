import _extends from 'babel-runtime/helpers/extends';
/**
 * Internal dependencies
 */
import namespaceAndEndpointMiddleware from './namespace-endpoint';

var createRootURLMiddleware = function createRootURLMiddleware(rootURL) {
	return function (options, next) {
		return namespaceAndEndpointMiddleware(options, function (optionsWithPath) {
			var url = optionsWithPath.url;
			var path = optionsWithPath.path;
			var apiRoot = void 0;

			if (typeof path === 'string') {
				apiRoot = rootURL;

				if (-1 !== rootURL.indexOf('?')) {
					path = path.replace('?', '&');
				}

				path = path.replace(/^\//, '');

				// API root may already include query parameter prefix if site is
				// configured to use plain permalinks.
				if ('string' === typeof apiRoot && -1 !== apiRoot.indexOf('?')) {
					path = path.replace('?', '&');
				}

				url = apiRoot + path;
			}

			return next(_extends({}, optionsWithPath, {
				url: url
			}));
		});
	};
};

export default createRootURLMiddleware;