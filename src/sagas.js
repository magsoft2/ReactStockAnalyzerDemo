import { all } from 'redux-saga/effects';

import { securityAnalysisRootSaga } from 'pages/StockAnalysis/sagas';
import { securitySearchSaga } from 'pages/StockAnalysis/components/SecuritySelector/sagas';


export function* rootSaga () {
    yield all([
        securityAnalysisRootSaga(),
        securitySearchSaga()
    ]);
}