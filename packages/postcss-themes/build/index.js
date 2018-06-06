'use strict';

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-test-plugin', function (options) {
	return function (root) {
		root.walkRules(function (rule) {
			var themeDecls = {};
			var hasThemeDecls = false;
			rule.walkDecls(function (decl) {
				var themeMatch = /(theme\(([^\)]*)\))/g;
				if (!decl.value) {
					return;
				}
				var matched = decl.value.match(themeMatch);
				if (!matched) {
					return;
				}
				var value = decl.value;
				var parsed = void 0;
				var themeValues = {};

				var _loop = function _loop() {
					var _parsed = parsed,
					    _parsed2 = (0, _slicedToArray3.default)(_parsed, 3),
					    whole = _parsed2[1],
					    color = _parsed2[2];

					var colorKey = color.trim();
					var defaultColor = options.defaults[colorKey];
					value = value.replace(whole, defaultColor);

					(0, _entries2.default)(options.themes).forEach(function (_ref) {
						var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
						    key = _ref2[0],
						    colors = _ref2[1];

						var previousValue = themeValues[key] ? themeValues[key] : decl.value;
						themeValues[key] = previousValue.replace(whole, colors[colorKey]);
					});
				};

				while ((parsed = themeMatch.exec(decl.value)) !== null) {
					_loop();
				}

				hasThemeDecls = true;
				decl.value = value;
				(0, _keys2.default)(options.themes).forEach(function (key) {
					var themeDecl = decl.clone();
					themeDecl.value = themeValues[key];
					if (!themeDecls[key]) {
						themeDecls[key] = [];
					}
					themeDecls[key].push(themeDecl);
				});
			});

			if (hasThemeDecls) {
				(0, _keys2.default)(options.themes).forEach(function (key) {
					var newRule = postcss.rule({
						selector: rule.selector.split(',').map(function (subselector) {
							return 'body.' + key + ' ' + subselector.trim();
						}).join(', ')
					});
					themeDecls[key].forEach(function (decl) {
						return newRule.append(decl);
					});
					rule.parent.insertAfter(rule, newRule);
				});
			}
		});
	};
});