"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.annotations = annotations;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread3 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Filters an array based on the predicate, but keeps the reference the same if
 * the array hasn't changed.
 *
 * @param {Array}    collection The collection to filter.
 * @param {Function} predicate  Function that determines if the item should stay
 *                              in the array.
 * @return {Array} Filtered array.
 */
function filterWithReference(collection, predicate) {
  var filteredCollection = collection.filter(predicate);
  return collection.length === filteredCollection.length ? collection : filteredCollection;
}
/**
 * Verifies whether the given annotations is a valid annotation.
 *
 * @param {Object} annotation The annotation to verify.
 * @return {boolean} Whether the given annotation is valid.
 */


function isValidAnnotationRange(annotation) {
  return (0, _lodash.isNumber)(annotation.start) && (0, _lodash.isNumber)(annotation.end) && annotation.start <= annotation.end;
}
/**
 * Reducer managing annotations.
 *
 * @param {Array} state The annotations currently shown in the editor.
 * @param {Object} action Dispatched action.
 *
 * @return {Array} Updated state.
 */


function annotations() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    all: [],
    byBlockClientId: {}
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case 'ANNOTATION_ADD':
      var blockClientId = action.blockClientId;
      var newAnnotation = {
        id: action.id,
        blockClientId: blockClientId,
        richTextIdentifier: action.richTextIdentifier,
        source: action.source,
        selector: action.selector,
        range: action.range
      };

      if (newAnnotation.selector === 'range' && !isValidAnnotationRange(newAnnotation.range)) {
        return state;
      }

      var previousAnnotationsForBlock = state.byBlockClientId[blockClientId] || [];
      return {
        all: (0, _toConsumableArray2.default)(state.all).concat([newAnnotation]),
        byBlockClientId: (0, _objectSpread3.default)({}, state.byBlockClientId, (0, _defineProperty2.default)({}, blockClientId, (0, _toConsumableArray2.default)(previousAnnotationsForBlock).concat([action.id])))
      };

    case 'ANNOTATION_REMOVE':
      return {
        all: state.all.filter(function (annotation) {
          return annotation.id !== action.annotationId;
        }),
        // We use filterWithReference to not refresh the reference if a block still has
        // the same annotations.
        byBlockClientId: (0, _lodash.mapValues)(state.byBlockClientId, function (annotationForBlock) {
          return filterWithReference(annotationForBlock, function (annotationId) {
            return annotationId !== action.annotationId;
          });
        })
      };

    case 'ANNOTATION_REMOVE_SOURCE':
      var idsToRemove = [];
      var allAnnotations = state.all.filter(function (annotation) {
        if (annotation.source === action.source) {
          idsToRemove.push(annotation.id);
          return false;
        }

        return true;
      });
      return {
        all: allAnnotations,
        byBlockClientId: (0, _lodash.mapValues)(state.byBlockClientId, function (annotationForBlock) {
          return filterWithReference(annotationForBlock, function (annotationId) {
            return !idsToRemove.includes(annotationId);
          });
        })
      };
  }

  return state;
}

var _default = annotations;
exports.default = _default;
//# sourceMappingURL=reducer.js.map