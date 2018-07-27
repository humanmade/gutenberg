import _extends from "@babel/runtime/helpers/extends";
import { createElement } from "@wordpress/element";

/**
 * Internal dependencies
 */
import { buildTermsTree } from './terms';
import TreeSelect from '../tree-select';
export default function CategorySelect(_ref) {
  var label = _ref.label,
      noOptionLabel = _ref.noOptionLabel,
      categoriesList = _ref.categoriesList,
      selectedCategoryId = _ref.selectedCategoryId,
      onChange = _ref.onChange;
  var termsTree = buildTermsTree(categoriesList);
  return createElement(TreeSelect, _extends({
    label: label,
    noOptionLabel: noOptionLabel,
    onChange: onChange
  }, {
    tree: termsTree,
    selectedId: selectedCategoryId
  }));
}