import moment from 'moment';
import { all, put, fork, call } from 'redux-saga/effects';


import { SecurityService, CacheService, LogService } from 'Services';
import {DefaultCollections} from 'domain/defaultCollections';
import {updateSecuritiesData} from 'domain/securityUpdater';

import { showMessage } from 'components/GlobalNotification';


import {setInitializedState} from './actions';
import {CONSTANTS} from '../constants';


export function* initialSaga() {
    
    const references = yield CacheService.getOrAdd('get_all_references', function*() {
            
        try {
            const indexes = DefaultCollections.createDefaultIndexList();

            const HISTORY_HORIZON_YEAR = 1;
            const startDate = moment().add( -1 * HISTORY_HORIZON_YEAR, 'years' ).format( CONSTANTS.dateFormat );

            const refs = yield SecurityService.getAllReferences();
            refs.indexes = yield updateSecuritiesData( indexes, startDate);

            return refs;

        } catch (err) {
            LogService.error('getting all references error, ', err);
        }

    });

    yield put(setInitializedState(references));
    yield put(showMessage('', 0));

}