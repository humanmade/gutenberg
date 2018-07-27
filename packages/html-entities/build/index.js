"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeEntities = decodeEntities;

var _decodeTextArea;

function decodeEntities(html) {
  // not a string, or no entities to decode
  if ('string' !== typeof html || -1 === html.indexOf('&')) {
    return html;
  } // create a textarea for decoding entities, that we can reuse


  if (undefined === _decodeTextArea) {
    if (document.implementation && document.implementation.createHTMLDocument) {
      _decodeTextArea = document.implementation.createHTMLDocument('').createElement('textarea');
    } else {
      _decodeTextArea = document.createElement('textarea');
    }
  }

  _decodeTextArea.innerHTML = html;
  var decoded = _decodeTextArea.textContent;
  _decodeTextArea.innerHTML = '';
  return decoded;
}