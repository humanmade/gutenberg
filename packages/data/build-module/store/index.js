/**
 * Internal dependencies
 */
import { registerStore } from '../';

import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

export default function registerDataStore() {
	registerStore('core/data', {
		reducer: reducer,
		actions: actions,
		selectors: selectors
	});
}