"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextInserterItem = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _blocks = require("@wordpress/blocks");

var _components = require("@wordpress/components");

var _data = require("@wordpress/data");

var _inserterListItem = _interopRequireDefault(require("../inserter-list-item"));

var _menu = require("../inserter/menu");

/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
function isResult(keywords, filterValue) {
  return keywords.some(function (string) {
    return (0, _menu.normalizeTerm)(string).indexOf((0, _menu.normalizeTerm)(filterValue)) !== -1;
  });
}

var RichTextInserterItem = (0, _data.withSelect)(function (select, _ref) {
  var name = _ref.name;
  return {
    formatType: select('core/rich-text').getFormatType(name)
  };
})(function (props) {
  return (0, _element.createElement)(_components.Fill, {
    name: "Inserter.InlineElements"
  }, function (_ref2) {
    var filterValue = _ref2.filterValue;
    var _props$formatType = props.formatType,
        _props$formatType$key = _props$formatType.keywords,
        keywords = _props$formatType$key === void 0 ? [] : _props$formatType$key,
        title = _props$formatType.title;
    keywords.push(title, props.title);

    if (filterValue && !isResult(keywords, filterValue)) {
      return null;
    }

    return (0, _element.createElement)(_inserterListItem.default, (0, _extends2.default)({}, props, {
      icon: (0, _blocks.normalizeIconObject)(props.icon)
    }));
  });
});
exports.RichTextInserterItem = RichTextInserterItem;
//# sourceMappingURL=inserter-list-item.js.map