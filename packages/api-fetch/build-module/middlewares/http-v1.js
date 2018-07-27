import _objectSpread from "@babel/runtime/helpers/objectSpread";

function httpV1Middleware(options, next) {
  var newOptions = _objectSpread({}, options);

  if (newOptions.method) {
    if (['PATCH', 'PUT', 'DELETE'].indexOf(newOptions.method.toUpperCase()) >= 0) {
      if (!newOptions.headers) {
        newOptions.headers = {};
      }

      newOptions.headers['X-HTTP-Method-Override'] = newOptions.method;
      newOptions.headers['Content-Type'] = 'application/json';
      newOptions.method = 'POST';
    }
  }

  return next(newOptions, next);
}

export default httpV1Middleware;