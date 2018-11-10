import _extends from "@babel/runtime/helpers/esm/extends";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { select, dispatch, withSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
/**
 * Registers a new format provided a unique name and an object defining its
 * behavior.
 *
 * @param {string} name     Format name.
 * @param {Object} settings Format settings.
 *
 * @return {?WPFormat} The format, if it has been successfully registered;
 *                     otherwise `undefined`.
 */

export function registerFormatType(name, settings) {
  settings = _objectSpread({
    name: name
  }, settings);

  if (typeof settings.name !== 'string') {
    window.console.error('Format names must be strings.');
    return;
  }

  if (!/^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test(settings.name)) {
    window.console.error('Format names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-format');
    return;
  }

  if (select('core/rich-text').getFormatType(settings.name)) {
    window.console.error('Format "' + settings.name + '" is already registered.');
    return;
  }

  if (typeof settings.tagName !== 'string' || settings.tagName === '') {
    window.console.error('Format tag names must be a string.');
    return;
  }

  if ((typeof settings.className !== 'string' || settings.className === '') && settings.className !== null) {
    window.console.error('Format class names must be a string, or null to handle bare elements.');
    return;
  }

  if (!/^[_a-zA-Z]+[a-zA-Z0-9-]*$/.test(settings.className)) {
    window.console.error('A class name must begin with a letter, followed by any number of hyphens, letters, or numbers.');
    return;
  }

  if (settings.className === null) {
    var formatTypeForBareElement = select('core/rich-text').getFormatTypeForBareElement(settings.tagName);

    if (formatTypeForBareElement) {
      window.console.error("Format \"".concat(formatTypeForBareElement.name, "\" is already registered to handle bare tag name \"").concat(settings.tagName, "\"."));
      return;
    }
  } else {
    var formatTypeForClassName = select('core/rich-text').getFormatTypeForClassName(settings.className);

    if (formatTypeForClassName) {
      window.console.error("Format \"".concat(formatTypeForClassName.name, "\" is already registered to handle class name \"").concat(settings.className, "\"."));
      return;
    }
  }

  if (!('title' in settings) || settings.title === '') {
    window.console.error('The format "' + settings.name + '" must have a title.');
    return;
  }

  if ('keywords' in settings && settings.keywords.length > 3) {
    window.console.error('The format "' + settings.name + '" can have a maximum of 3 keywords.');
    return;
  }

  if (typeof settings.title !== 'string') {
    window.console.error('Format titles must be strings.');
    return;
  }

  dispatch('core/rich-text').addFormatTypes(settings);

  if (settings.__experimentalCreatePrepareEditableTree && settings.__experimentalGetPropsForEditableTreePreparation) {
    addFilter('experimentalRichText', name, function (OriginalComponent) {
      return withSelect(function (sel, _ref) {
        var clientId = _ref.clientId,
            identifier = _ref.identifier;
        return _defineProperty({}, "format_".concat(name), settings.__experimentalGetPropsForEditableTreePreparation(sel, {
          richTextIdentifier: identifier,
          blockClientId: clientId
        }));
      })(function (props) {
        return createElement(OriginalComponent, _extends({}, props, {
          prepareEditableTree: _toConsumableArray(props.prepareEditableTree || []).concat([settings.__experimentalCreatePrepareEditableTree(props["format_".concat(name)], {
            richTextIdentifier: props.identifier,
            blockClientId: props.clientId
          })])
        }));
      });
    });
  }

  return settings;
}
//# sourceMappingURL=register-format-type.js.map