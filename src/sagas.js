import { delay } from "redux-saga";
import { all, put, fork } from 'redux-saga/effects';

import { securityAnalysisRootSaga } from 'pages/StockAnalysis';
import { securitySearchSagaRootSaga } from 'pages/StockAnalysis/components/SecuritySelector';

import {ACTIONS} from './reducers';

function* initialSaga() {
    
    yield delay(5000);

    yield put({type: ACTIONS.INITIALIZE_COMPLETED, data: {}});

 }


export function* rootSaga () {
    
    yield fork(initialSaga);

    yield all([
        securityAnalysisRootSaga(),
        securitySearchSagaRootSaga()
    ]);
}