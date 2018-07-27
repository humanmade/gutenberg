import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import classnames from 'classnames';
import { flatMap } from 'lodash';
/**
 * Internal dependencies
 */

import IconButton from '../icon-button';
/**
 * Renders a toolbar with controls.
 *
 * The `controls` prop accepts an array of sets. A set is an array of controls.
 * Controls have the following shape:
 *
 * ```
 * {
 *   icon: string,
 *   title: string,
 *   subscript: string,
 *   onClick: Function,
 *   isActive: boolean,
 *   isDisabled: boolean
 * }
 * ```
 *
 * For convenience it is also possible to pass only an array of controls. It is
 * then assumed this is the only set.
 *
 * Either `controls` or `children` is required, otherwise this components
 * renders nothing.
 *
 * @param {?Array}        controls  The controls to render in this toolbar.
 * @param {?ReactElement} children  Any other things to render inside the
 *                                  toolbar besides the controls.
 * @param {?string}       className Class to set on the container div.
 *
 * @return {ReactElement} The rendered toolbar.
 */

function Toolbar(_ref) {
  var _ref$controls = _ref.controls,
      controls = _ref$controls === void 0 ? [] : _ref$controls,
      children = _ref.children,
      className = _ref.className;

  if ((!controls || !controls.length) && !children) {
    return null;
  } // Normalize controls to nested array of objects (sets of controls)


  var controlSets = controls;

  if (!Array.isArray(controlSets[0])) {
    controlSets = [controlSets];
  }

  return createElement("div", {
    className: classnames('components-toolbar', className)
  }, flatMap(controlSets, function (controlSet, indexOfSet) {
    return controlSet.map(function (control, indexOfControl) {
      return createElement("div", {
        key: [indexOfSet, indexOfControl].join(),
        className: indexOfSet > 0 && indexOfControl === 0 ? 'has-left-divider' : null
      }, createElement(IconButton, {
        icon: control.icon,
        label: control.title,
        shortcut: control.shortcut,
        "data-subscript": control.subscript,
        onClick: function onClick(event) {
          event.stopPropagation();
          control.onClick();
        },
        className: classnames('components-toolbar__control', {
          'is-active': control.isActive
        }),
        "aria-pressed": control.isActive,
        disabled: control.isDisabled
      }), control.children);
    });
  }), children);
}

export default Toolbar;