"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.createBlobURL = createBlobURL;
exports.getBlobByURL = getBlobByURL;
exports.revokeBlobURL = revokeBlobURL;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Browser dependencies
 */
var _window = window,
    fetch = _window.fetch;
var _window$URL = window.URL,
    createObjectURL = _window$URL.createObjectURL,
    revokeObjectURL = _window$URL.revokeObjectURL;


var cache = {};

function createBlobURL(blob) {
	var url = createObjectURL(blob);

	cache[url] = blob;

	return url;
}

function getBlobByURL(url) {
	if (cache[url]) {
		return _promise2.default.resolve(cache[url]);
	}

	return fetch(url).then(function (response) {
		return response.blob();
	});
}

function revokeBlobURL(url) {
	if (cache[url]) {
		revokeObjectURL(url);
	}

	delete cache[url];
}