import "core-js/modules/es6.string.link";
import _Object$create from "@babel/runtime/core-js/object/create";

/**
 * Object map tracking messages which have been logged, for use in ensuring a
 * message is only logged once.
 *
 * @type {Object}
 */
export var logged = _Object$create(null);
/**
 * Logs a message to notify developers about a deprecated feature.
 *
 * @param {string}  feature             Name of the deprecated feature.
 * @param {?Object} options             Personalisation options
 * @param {?string} options.version     Version in which the feature will be removed.
 * @param {?string} options.alternative Feature to use instead
 * @param {?string} options.plugin      Plugin name if it's a plugin feature
 * @param {?string} options.link        Link to documentation
 * @param {?string} options.hint        Additional message to help transition away from the deprecated feature.
 */

export default function deprecated(feature) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      version = _ref.version,
      alternative = _ref.alternative,
      plugin = _ref.plugin,
      link = _ref.link,
      hint = _ref.hint;

  var pluginMessage = plugin ? " from ".concat(plugin) : '';
  var versionMessage = version ? "".concat(pluginMessage, " in ").concat(version) : '';
  var useInsteadMessage = alternative ? " Please use ".concat(alternative, " instead.") : '';
  var linkMessage = link ? " See: ".concat(link) : '';
  var hintMessage = hint ? " Note: ".concat(hint) : '';
  var message = "".concat(feature, " is deprecated and will be removed").concat(versionMessage, ".").concat(useInsteadMessage).concat(linkMessage).concat(hintMessage); // Skip if already logged.

  if (message in logged) {
    return;
  } // eslint-disable-next-line no-console


  console.warn(message);
  logged[message] = true;
}