import { delay } from "redux-saga";
import { all, put, fork, call } from 'redux-saga/effects';
import moment from 'moment';

import { securityAnalysisRootSaga } from 'pages/StockAnalysis';
import { securitySearchSagaRootSaga } from 'components/SecuritySelector';
import { portfolioManagerRootSaga } from 'pages/Portfolio';

import { SecurityService, CacheService, LogService } from "Services";
import {DefaultCollections} from 'domain/defaultCollections';
import {updateSecuritiesData} from 'domain/securityUpdater';

import { showMessage } from 'components/GlobalNotification';


import {ACTIONS} from './reducers';
import {CONSTANTS} from './constants';

function* initialSaga() {
    
    const references = yield CacheService.getOrAdd('get_all_references', function*() {
            
        try {
            const indexes = DefaultCollections.createDefaultIndexList();

            const HISTORY_HORIZON_YEAR = 1;
            const startDate = moment().add( -1 * HISTORY_HORIZON_YEAR, 'years' ).format( CONSTANTS.dateFormat );

            const descr = yield SecurityService.getAllReferences();
            descr.indexes = yield updateSecuritiesData( indexes, startDate);

            return descr;

        } catch (err) {
            LogService.error('getting all references error, ', err);
        }

    });

    yield put({type: ACTIONS.INITIALIZE_COMPLETED, data: {references}});
    yield put(showMessage('', 0));

}


export function* rootSaga () {
    
    yield fork(initialSaga);

    yield all([
        securityAnalysisRootSaga(),
        securitySearchSagaRootSaga(),
        portfolioManagerRootSaga()
    ]);
}