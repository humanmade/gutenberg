import _Object$entries from 'babel-runtime/core-js/object/entries';
import _slicedToArray from 'babel-runtime/helpers/slicedToArray';
import _Object$keys from 'babel-runtime/core-js/object/keys';
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
					    _parsed2 = _slicedToArray(_parsed, 3),
					    whole = _parsed2[1],
					    color = _parsed2[2];

					var colorKey = color.trim();
					var defaultColor = options.defaults[colorKey];
					value = value.replace(whole, defaultColor);

					_Object$entries(options.themes).forEach(function (_ref) {
						var _ref2 = _slicedToArray(_ref, 2),
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
				_Object$keys(options.themes).forEach(function (key) {
					var themeDecl = decl.clone();
					themeDecl.value = themeValues[key];
					if (!themeDecls[key]) {
						themeDecls[key] = [];
					}
					themeDecls[key].push(themeDecl);
				});
			});

			if (hasThemeDecls) {
				_Object$keys(options.themes).forEach(function (key) {
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