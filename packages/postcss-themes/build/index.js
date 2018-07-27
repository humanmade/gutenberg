"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es6.regexp.split");

var _entries = _interopRequireDefault(require("@babel/runtime/core-js/object/entries"));

require("core-js/modules/es6.regexp.replace");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.match");

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
        var parsed;
        var themeValues = {};

        var _loop = function _loop() {
          var _parsed = parsed,
              _parsed2 = (0, _slicedToArray2.default)(_parsed, 3),
              whole = _parsed2[1],
              color = _parsed2[2];

          var colorKey = color.trim();
          var defaultColor = options.defaults[colorKey];
          value = value.replace(whole, defaultColor);
          (0, _entries.default)(options.themes).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
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
        (0, _keys.default)(options.themes).forEach(function (key) {
          var themeDecl = decl.clone();
          themeDecl.value = themeValues[key];

          if (!themeDecls[key]) {
            themeDecls[key] = [];
          }

          themeDecls[key].push(themeDecl);
        });
      });

      if (hasThemeDecls) {
        (0, _keys.default)(options.themes).forEach(function (key) {
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