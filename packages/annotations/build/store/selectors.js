"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__experimentalGetAnnotations = __experimentalGetAnnotations;
exports.__experimentalGetAnnotationsForRichText = exports.__experimentalGetAnnotationsForBlock = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _rememo = _interopRequireDefault(require("rememo"));

/**
 * External dependencies
 */

/**
 * Returns the annotations for a specific client ID.
 *
 * @param {Object} state Editor state.
 * @param {string} clientId The ID of the block to get the annotations for.
 *
 * @return {Array} The annotations applicable to this block.
 */
var __experimentalGetAnnotationsForBlock = (0, _rememo.default)(function (state, blockClientId) {
  return state.all.filter(function (annotation) {
    return annotation.selector === 'block' && annotation.blockClientId === blockClientId;
  });
}, function (state, blockClientId) {
  return [state.byBlockClientId[blockClientId]];
});
/**
 * Returns the annotations that apply to the given RichText instance.
 *
 * Both a blockClientId and a richTextIdentifier are required. This is because
 * a block might have multiple `RichText` components. This does mean that every
 * block needs to implement annotations itself.
 *
 * @param {Object} state              Editor state.
 * @param {string} blockClientId      The client ID for the block.
 * @param {string} richTextIdentifier Unique identifier that identifies the given RichText.
 * @return {Array} All the annotations relevant for the `RichText`.
 */


exports.__experimentalGetAnnotationsForBlock = __experimentalGetAnnotationsForBlock;

var __experimentalGetAnnotationsForRichText = (0, _rememo.default)(function (state, blockClientId, richTextIdentifier) {
  return state.all.filter(function (annotation) {
    return annotation.selector === 'range' && annotation.blockClientId === blockClientId && richTextIdentifier === annotation.richTextIdentifier;
  }).map(function (annotation) {
    var range = annotation.range,
        other = (0, _objectWithoutProperties2.default)(annotation, ["range"]);
    return (0, _objectSpread2.default)({}, range, other);
  });
}, function (state, blockClientId) {
  return [state.byBlockClientId[blockClientId]];
});
/**
 * Returns all annotations in the editor state.
 *
 * @param {Object} state Editor state.
 * @return {Array} All annotations currently applied.
 */


exports.__experimentalGetAnnotationsForRichText = __experimentalGetAnnotationsForRichText;

function __experimentalGetAnnotations(state) {
  return state.all;
}
//# sourceMappingURL=selectors.js.map