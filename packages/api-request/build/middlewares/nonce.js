'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createNonceMiddleware = function createNonceMiddleware(nonce) {
	return function (options, next) {
		var usedNonce = nonce;
		/**
   * This is not ideal but it's fine for now.
   *
   * Configure heartbeat to refresh the wp-api nonce, keeping the editor
   * authorization intact.
   */
		(0, _jquery2.default)(document).on('heartbeat-tick', function (event, response) {
			if (response['rest-nonce']) {
				usedNonce = response['rest-nonce'];
			}
		});

		// If ?_wpnonce=... is present, no need to add a nonce header.
		var addNonceHeader = !(options.data && options.data._wpnonce);
		var headers = options.headers || {};

		// If an 'X-WP-Nonce' header (or any case-insensitive variation
		// thereof) was specified, no need to add a nonce header.
		if (addNonceHeader) {
			for (var headerName in headers) {
				if (headers.hasOwnProperty(headerName)) {
					if (headerName.toLowerCase() === 'x-wp-nonce') {
						addNonceHeader = false;
						break;
					}
				}
			}
		}

		if (addNonceHeader) {
			// Do not mutate the original headers object, if any.
			headers = (0, _extends3.default)({}, headers, {
				'X-WP-Nonce': usedNonce
			});
		}

		return next((0, _extends3.default)({}, options, {
			headers: headers
		}));
	};
}; /**
    * External dependencies
    */
exports.default = createNonceMiddleware;