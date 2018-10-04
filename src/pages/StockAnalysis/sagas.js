import { delay } from 'redux-saga';
import { put, takeEvery, all, call, select } from 'redux-saga/effects';

import { showLoader, hideLoader, showMessage, setProgress } from 'components/GlobalNotification';

import { StoreService, LogService, SecurityService } from 'Services';

import {
    ACTIONS,
    showStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, addSecurityToListStarted, addSecurityToListSucceeded, addSecurityToListFailed,
    updateAll, updateAllStarted, updateAllSucceeded, updateAllFailed
} from './actions';

import { selectors } from './reducers';


function* restoreState () {

    const { securities = undefined, indicators = [] } = yield call( StoreService.restoreStockAnalysisState );

    const data = {
        indicators
    };

    if ( securities ) {
        LogService.log( 'StockAnalysis: project state was initialized from store' );
        data.securities = securities;
    } else {
        LogService.log( 'StockAnalysis: no stored project state was found. Initializing .' );
    }

    yield put( showStockAnalysisState( data ) );

    const state = yield select();

    const uncompleteSecurities = (data.securities ? data.securities : selectors.getSecuritiesSelected(state)).filter( a => !a.description );

    if ( uncompleteSecurities.length > 0 || !data.securities) {
        yield put( updateAll( uncompleteSecurities, selectors.getStartDate( state ) ) );
    }
}

function* storeState ( action ) {

    const state = yield select();
    let { securities = undefined, indicators = undefined } = action.data ? action.data : {};

    if ( !securities )
        securities = selectors.getSecuritiesSelected( state );
    if ( !indicators )
        indicators = selectors.getIndicatorsSelected( state );

    const data = { securities, indicators };
    yield call( StoreService.storeStockAnalysisState, data );

}



function* addSecurity ( action ) {

    yield put( addSecurityToListStarted() );

    const { security, startDate } = action.data;

    try {
        if ( security ) {

            yield put( showLoader() );

            const [ description, history ] = yield all(
                [ call( SecurityService.getSecurityDescription, security.securityId ),
                call( getSecurityHistory, security.securityId, security.group, startDate ) ] );

            yield put( addSecurityToListSucceeded( security, history, description ) );

            yield put( storeStockAnalysisState() );

        }
    } catch ( error ) {
        LogService.error( 'Cannot add security ' + security.securityId, error );
        yield put( addSecurityToListFailed( 'Cannot add security ' + security.securityId + ', error: ' + error ) );
    }

    yield put( hideLoader() );

}

function* updateAllSaga ( action ) {

    yield put( showMessage( 'Update all data...', 0 ) );
    yield put( showLoader() );
    yield put( updateAllStarted() );

    const { securities, startDate } = action.data;

    try {

        if ( securities && securities.length ) {
            let counter = 1;
            for ( const item of securities ) {

                yield put( showMessage(`Updating ${item.definition.name ? item.definition.name : item.securityId}...`, Math.round(counter*100/securities.length) ) );

                const [ description, history ] = yield all(
                    [ call( SecurityService.getSecurityDescription, item.securityId ),
                    call( getSecurityHistory, item.securityId, item.definition.group, startDate ) ]
                );

                item.history = history ? history : item.history;
                item.description = description ? description : item.description;

                counter++;
            }
        }

        yield put( updateAllSucceeded( securities ) );

        yield put( storeStockAnalysisState() );

    } catch ( error ) {
        LogService.error( 'Cannot update all ', error );
        yield put( updateAllFailed( 'Cannot add security ' + ', error: ' + error ) );
        return;
    }

    yield put( showMessage('', 0) );
    yield put( hideLoader() );

}

const getSecurityHistory = async ( securityId, securityGroup, startDate ) => {

    const resHist = await SecurityService.getSecurityHistory( securityId, securityGroup, startDate );

    return {
        securityId: securityId,
        candles: resHist
    };
};


export function* securityAnalysisRootSaga () {
    yield all( [
        takeEvery( ACTIONS.STOCKANALYSIS_STATE_RESTORE, restoreState ),
        takeEvery( ACTIONS.STOCKANALYSIS_STATE_STORE, storeState ),
        takeEvery( ACTIONS.STOCKANALYSIS_SECURITY_ADD, addSecurity ),
        takeEvery( ACTIONS.STOCKANALYSIS_UPDATE_ALL, updateAllSaga ),
    ] );
}