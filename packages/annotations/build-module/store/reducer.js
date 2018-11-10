import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

/**
 * External dependencies
 */
import { isNumber, mapValues } from 'lodash';
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
  return isNumber(annotation.start) && isNumber(annotation.end) && annotation.start <= annotation.end;
}
/**
 * Reducer managing annotations.
 *
 * @param {Array} state The annotations currently shown in the editor.
 * @param {Object} action Dispatched action.
 *
 * @return {Array} Updated state.
 */


export function annotations() {
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
        all: _toConsumableArray(state.all).concat([newAnnotation]),
        byBlockClientId: _objectSpread({}, state.byBlockClientId, _defineProperty({}, blockClientId, _toConsumableArray(previousAnnotationsForBlock).concat([action.id])))
      };

    case 'ANNOTATION_REMOVE':
      return {
        all: state.all.filter(function (annotation) {
          return annotation.id !== action.annotationId;
        }),
        // We use filterWithReference to not refresh the reference if a block still has
        // the same annotations.
        byBlockClientId: mapValues(state.byBlockClientId, function (annotationForBlock) {
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
        byBlockClientId: mapValues(state.byBlockClientId, function (annotationForBlock) {
          return filterWithReference(annotationForBlock, function (annotationId) {
            return !idsToRemove.includes(annotationId);
          });
        })
      };
  }

  return state;
}
export default annotations;
//# sourceMappingURL=reducer.js.map