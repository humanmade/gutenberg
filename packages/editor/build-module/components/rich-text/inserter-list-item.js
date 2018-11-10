import _extends from "@babel/runtime/helpers/esm/extends";
import { createElement } from "@wordpress/element";

/**
 * WordPress dependencies
 */
import { normalizeIconObject } from '@wordpress/blocks';
import { Fill } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
/**
 * Internal dependencies
 */

import InserterListItem from '../inserter-list-item';
import { normalizeTerm } from '../inserter/menu';

function isResult(keywords, filterValue) {
  return keywords.some(function (string) {
    return normalizeTerm(string).indexOf(normalizeTerm(filterValue)) !== -1;
  });
}

export var RichTextInserterItem = withSelect(function (select, _ref) {
  var name = _ref.name;
  return {
    formatType: select('core/rich-text').getFormatType(name)
  };
})(function (props) {
  return createElement(Fill, {
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

    return createElement(InserterListItem, _extends({}, props, {
      icon: normalizeIconObject(props.icon)
    }));
  });
});
//# sourceMappingURL=inserter-list-item.js.map