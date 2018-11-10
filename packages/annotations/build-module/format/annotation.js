/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
var name = 'core/annotation';
/**
 * WordPress dependencies
 */

import { applyFormat, removeFormat } from '@wordpress/rich-text';
/**
 * Applies given annotations to the given record.
 *
 * @param {Object} record The record to apply annotations to.
 * @param {Array} annotations The annotation to apply.
 * @return {Object} A record with the annotations applied.
 */

export function applyAnnotations(record) {
  var annotations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  annotations.forEach(function (annotation) {
    var start = annotation.start,
        end = annotation.end;

    if (start > record.text.length) {
      start = record.text.length;
    }

    if (end > record.text.length) {
      end = record.text.length;
    }

    var className = 'annotation-text-' + annotation.source;
    record = applyFormat(record, {
      type: 'core/annotation',
      attributes: {
        className: className
      }
    }, start, end);
  });
  return record;
}
/**
 * Removes annotations from the given record.
 *
 * @param {Object} record Record to remove annotations from.
 * @return {Object} The cleaned record.
 */

export function removeAnnotations(record) {
  return removeFormat(record, 'core/annotation', 0, record.text.length);
}
export var annotation = {
  name: name,
  title: __('Annotation'),
  tagName: 'mark',
  className: 'annotation-text',
  attributes: {
    className: 'class'
  },
  edit: function edit() {
    return null;
  },
  __experimentalGetPropsForEditableTreePreparation: function __experimentalGetPropsForEditableTreePreparation(select, _ref) {
    var richTextIdentifier = _ref.richTextIdentifier,
        blockClientId = _ref.blockClientId;
    return {
      annotations: select('core/annotations').__experimentalGetAnnotationsForRichText(blockClientId, richTextIdentifier)
    };
  },
  __experimentalCreatePrepareEditableTree: function __experimentalCreatePrepareEditableTree(props) {
    return function (formats, text) {
      if (props.annotations.length === 0) {
        return formats;
      }

      var record = {
        formats: formats,
        text: text
      };
      record = applyAnnotations(record, props.annotations);
      return record.formats;
    };
  }
};
//# sourceMappingURL=annotation.js.map