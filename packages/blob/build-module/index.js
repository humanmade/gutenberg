import _Promise from "babel-runtime/core-js/promise";
/**
 * Browser dependencies
 */
var _window = window,
    fetch = _window.fetch;
var _window$URL = window.URL,
    createObjectURL = _window$URL.createObjectURL,
    revokeObjectURL = _window$URL.revokeObjectURL;


var cache = {};

export function createBlobURL(blob) {
	var url = createObjectURL(blob);

	cache[url] = blob;

	return url;
}

export function getBlobByURL(url) {
	if (cache[url]) {
		return _Promise.resolve(cache[url]);
	}

	return fetch(url).then(function (response) {
		return response.blob();
	});
}

export function revokeBlobURL(url) {
	if (cache[url]) {
		revokeObjectURL(url);
	}

	delete cache[url];
}