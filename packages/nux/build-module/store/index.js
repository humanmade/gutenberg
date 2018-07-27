/**
 * WordPress dependencies
 */
import { registerStore, restrictPersistence } from '@wordpress/data';
/**
 * Internal dependencies
 */

import reducer from './reducer';
import * as actions from './actions';
import * as selectors from './selectors';
var REDUCER_KEY = 'preferences';
var store = registerStore('core/nux', {
  reducer: restrictPersistence(reducer, REDUCER_KEY),
  actions: actions,
  selectors: selectors,
  persist: true
});
export default store;