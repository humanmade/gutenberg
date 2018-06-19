'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
				var deferred = _jquery2.default.Deferred();
				deferred.resolve(preloadedData[path].body);

				return deferred.promise();
			}
		}

		return next(options);
	};
}; /**
    * External dependencies
    */
exports.default = createPreloadingMiddleware;