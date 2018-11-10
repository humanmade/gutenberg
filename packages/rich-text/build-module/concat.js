/**
 * Internal dependencies
 */
import { normaliseFormats } from './normalise-formats';
/**
 * Combine all Rich Text values into one. This is similar to
 * `String.prototype.concat`.
 *
 * @param {...[object]} values An array of all values to combine.
 *
 * @return {Object} A new value combining all given records.
 */

export function concat() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return normaliseFormats(values.reduce(function (accumlator, _ref) {
    var formats = _ref.formats,
        text = _ref.text;
    return {
      text: accumlator.text + text,
      formats: accumlator.formats.concat(formats)
    };
  }));
}
//# sourceMappingURL=concat.js.map