/**
 * External dependencies
 */
import { find } from 'lodash';
/**
 * Internal dependencies
 */

import { normaliseFormats } from './normalise-formats';
/**
 * Remove any format object from a Rich Text value by type from the given
 * `startIndex` to the given `endIndex`. Indices are retrieved from the
 * selection if none are provided.
 *
 * @param {Object} value      Value to modify.
 * @param {string} formatType Format type to remove.
 * @param {number} startIndex Start index.
 * @param {number} endIndex   End index.
 *
 * @return {Object} A new value with the format applied.
 */

export function removeFormat(_ref, formatType) {
  var formats = _ref.formats,
      text = _ref.text,
      start = _ref.start,
      end = _ref.end;
  var startIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : start;
  var endIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : end;
  var newFormats = formats.slice(0); // If the selection is collapsed, expand start and end to the edges of the
  // format.

  if (startIndex === endIndex) {
    var format = find(newFormats[startIndex], {
      type: formatType
    });

    while (find(newFormats[startIndex], format)) {
      filterFormats(newFormats, startIndex, formatType);
      startIndex--;
    }

    endIndex++;

    while (find(newFormats[endIndex], format)) {
      filterFormats(newFormats, endIndex, formatType);
      endIndex++;
    }
  } else {
    for (var i = startIndex; i < endIndex; i++) {
      if (newFormats[i]) {
        filterFormats(newFormats, i, formatType);
      }
    }
  }

  return normaliseFormats({
    formats: newFormats,
    text: text,
    start: start,
    end: end
  });
}

function filterFormats(formats, index, formatType) {
  var newFormats = formats[index].filter(function (_ref2) {
    var type = _ref2.type;
    return type !== formatType;
  });

  if (newFormats.length) {
    formats[index] = newFormats;
  } else {
    delete formats[index];
  }
}
//# sourceMappingURL=remove-format.js.map