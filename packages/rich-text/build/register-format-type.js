"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFormatType = registerFormatType;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _data = require("@wordpress/data");

var _hooks = require("@wordpress/hooks");

/**
 * WordPress dependencies
 */

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
function registerFormatType(name, settings) {
  settings = (0, _objectSpread2.default)({
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

  if ((0, _data.select)('core/rich-text').getFormatType(settings.name)) {
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
    var formatTypeForBareElement = (0, _data.select)('core/rich-text').getFormatTypeForBareElement(settings.tagName);

    if (formatTypeForBareElement) {
      window.console.error("Format \"".concat(formatTypeForBareElement.name, "\" is already registered to handle bare tag name \"").concat(settings.tagName, "\"."));
      return;
    }
  } else {
    var formatTypeForClassName = (0, _data.select)('core/rich-text').getFormatTypeForClassName(settings.className);

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

  (0, _data.dispatch)('core/rich-text').addFormatTypes(settings);

  if (settings.__experimentalCreatePrepareEditableTree && settings.__experimentalGetPropsForEditableTreePreparation) {
    (0, _hooks.addFilter)('experimentalRichText', name, function (OriginalComponent) {
      return (0, _data.withSelect)(function (sel, _ref) {
        var clientId = _ref.clientId,
            identifier = _ref.identifier;
        return (0, _defineProperty2.default)({}, "format_".concat(name), settings.__experimentalGetPropsForEditableTreePreparation(sel, {
          richTextIdentifier: identifier,
          blockClientId: clientId
        }));
      })(function (props) {
        return (0, _element.createElement)(OriginalComponent, (0, _extends2.default)({}, props, {
          prepareEditableTree: (0, _toConsumableArray2.default)(props.prepareEditableTree || []).concat([settings.__experimentalCreatePrepareEditableTree(props["format_".concat(name)], {
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