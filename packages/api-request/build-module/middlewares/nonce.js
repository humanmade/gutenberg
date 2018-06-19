import _extends from 'babel-runtime/helpers/extends';
/**
 * External dependencies
 */
import jQuery from 'jquery';

var createNonceMiddleware = function createNonceMiddleware(nonce) {
	return function (options, next) {
		var usedNonce = nonce;
		/**
   * This is not ideal but it's fine for now.
   *
   * Configure heartbeat to refresh the wp-api nonce, keeping the editor
   * authorization intact.
   */
		jQuery(document).on('heartbeat-tick', function (event, response) {
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
			headers = _extends({}, headers, {
				'X-WP-Nonce': usedNonce
			});
		}

		return next(_extends({}, options, {
			headers: headers
		}));
	};
};

export default createNonceMiddleware;