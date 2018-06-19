'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _namespaceEndpoint = require('./namespace-endpoint');

var _namespaceEndpoint2 = _interopRequireDefault(_namespaceEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createRootURLMiddleware = function createRootURLMiddleware(rootURL) {
	return function (options, next) {
		return (0, _namespaceEndpoint2.default)(options, function (optionsWithPath) {
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

			return next((0, _extends3.default)({}, optionsWithPath, {
				url: url
			}));
		});
	};
}; /**
    * Internal dependencies
    */
exports.default = createRootURLMiddleware;