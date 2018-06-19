import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _extends from 'babel-runtime/helpers/extends';
function httpV1Middleware(options, next) {
	var newOptions = _extends({}, options);
	if (newOptions.method) {
		if (['PATCH', 'PUT', 'DELETE'].indexOf(newOptions.method.toUpperCase()) >= 0) {
			if (!newOptions.headers) {
				newOptions.headers = {};
			}
			newOptions.headers['X-HTTP-Method-Override'] = newOptions.method;
			newOptions.method = 'POST';

			newOptions.contentType = 'application/json';
			newOptions.data = _JSON$stringify(newOptions.data);
		}
	}

	return next(newOptions, next);
}

export default httpV1Middleware;