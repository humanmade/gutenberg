/**
 * External dependencies
 */
import jQuery from 'jquery';

var createPreloadingMiddleware = function createPreloadingMiddleware(preloadedData) {
	return function (options, next) {
		function getStablePath(path) {
			var splitted = path.split('?');
			var query = splitted[1];
			var base = splitted[0];
			if (!query) {
				return base;
			}

			// 'b=1&c=2&a=5'
			return base + '?' + query
			// [ 'b=1', 'c=2', 'a=5' ]
			.split('&')
			// [ [ 'b, '1' ], [ 'c', '2' ], [ 'a', '5' ] ]
			.map(function (entry) {
				return entry.split('=');
			})
			// [ [ 'a', '5' ], [ 'b, '1' ], [ 'c', '2' ] ]
			.sort(function (a, b) {
				return a[0].localeCompare(b[0]);
			})
			// [ 'a=5', 'b=1', 'c=2' ]
			.map(function (pair) {
				return pair.join('=');
			})
			// 'a=5&b=1&c=2'
			.join('&');
		}

		if (typeof options.path === 'string') {
			var method = options.method || 'GET';
			var path = getStablePath(options.path);

			if ('GET' === method && preloadedData[path]) {
				var deferred = jQuery.Deferred();
				deferred.resolve(preloadedData[path].body);

				return deferred.promise();
			}
		}

		return next(options);
	};
};

export default createPreloadingMiddleware;