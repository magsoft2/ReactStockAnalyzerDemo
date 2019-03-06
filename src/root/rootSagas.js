import { all, put, fork, call } from 'redux-saga/effects';

import { securityAnalysisRootSaga } from 'pages/StockAnalysis';
import { securitySearchSagaRootSaga } from 'components/SecuritySelector';
import { portfolioManagerRootSaga } from 'pages/Portfolio';


import {initialSaga} from './initializerSaga';


export function* rootSaga () {
    
    yield fork(initialSaga);

    yield all([
        securityAnalysisRootSaga(),
        securitySearchSagaRootSaga(),
        portfolioManagerRootSaga()
    ]);
}