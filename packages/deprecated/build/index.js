'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = deprecated;
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
function deprecated(feature) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      version = _ref.version,
      alternative = _ref.alternative,
      plugin = _ref.plugin,
      link = _ref.link,
      hint = _ref.hint;

  var pluginMessage = plugin ? ' from ' + plugin : '';
  var versionMessage = version ? pluginMessage + ' in ' + version : '';
  var useInsteadMessage = alternative ? ' Please use ' + alternative + ' instead.' : '';
  var linkMessage = link ? ' See: ' + link : '';
  var hintMessage = hint ? ' Note: ' + hint : '';
  var message = feature + ' is deprecated and will be removed' + versionMessage + '.' + useInsteadMessage + linkMessage + hintMessage;

  // eslint-disable-next-line no-console
  console.warn(message);
}