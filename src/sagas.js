import { delay } from "redux-saga";
import { all, put, fork } from 'redux-saga/effects';

import { securityAnalysisRootSaga } from 'pages/StockAnalysis';
import { securitySearchSagaRootSaga } from 'components/SecuritySelector';
import { portfolioManagerRootSaga } from 'pages/Portfolio';

import { SecurityService, CacheService, LogService } from "Services";

import {ACTIONS} from './reducers';

function* initialSaga() {
    
    const references = yield CacheService.getOrAdd('get_all_references', function*() {
            
        try {
            const descr = yield SecurityService.getAllReferences();
            return descr;
        } catch (err) {
            LogService.error('getting all references error, ', err);
        }

    });

    yield put({type: ACTIONS.INITIALIZE_COMPLETED, data: {references}});

}


export function* rootSaga () {
    
    yield fork(initialSaga);

    yield all([
        securityAnalysisRootSaga(),
        securitySearchSagaRootSaga(),
        portfolioManagerRootSaga()
    ]);
}