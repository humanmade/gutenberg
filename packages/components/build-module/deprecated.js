/**
 * External dependencies
 */
import { mapValues } from 'lodash';
/**
 * WordPress dependencies
 */

import { ifCondition, withGlobalEvents, withInstanceId, withSafeTimeout, withState } from '@wordpress/compose';
import deprecated from '@wordpress/deprecated';
var deprecatedFunctions = {
  ifCondition: ifCondition,
  withGlobalEvents: withGlobalEvents,
  withInstanceId: withInstanceId,
  withSafeTimeout: withSafeTimeout,
  withState: withState
};
export default mapValues(deprecatedFunctions, function (deprecatedFunction, key) {
  return function () {
    deprecated('wp.components.' + key, {
      version: '3.5',
      alternative: 'wp.compose.' + key
    });
    return deprecatedFunction.apply(void 0, arguments);
  };
});