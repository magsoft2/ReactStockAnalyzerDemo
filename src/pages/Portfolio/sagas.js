import { put, takeEvery, all, call, select } from 'redux-saga/effects';

import { showLoader, hideLoader, showMessage, setProgress } from 'components/GlobalNotification';

import { StoreService, LogService, SecurityService } from 'Services';

import {updateSecuritiesData, updateSecurityData} from 'domain/securityUpdater';

import {
    ACTIONS,
    showPortfolioState, storePortfolioState, processPortfolio,
    addSecurityToPortfolioStarted, addSecurityToPortfolioSucceeded, addSecurityToPortfolioFailed,
    updateAll, updateAllStarted, updateAllSucceeded, updateAllFailed
} from './actions';

import { globalSelectors } from './selectors';


function* restoreStateSaga () {

    const { positions = undefined } = yield call( StoreService.restorePortfolioState );

    const data = {
    };

    if ( positions ) {
        LogService.log( 'Portfolio: project state was initialized from store' );
        data.positions = positions;
    } else {
        LogService.log( 'Portfolio: no stored project state was found. Initializing .' );
    }

    yield put( showPortfolioState( data ) );

    const state = yield select();

    const uncompleteSecurities = ( data.positions ? data.positions : globalSelectors.getPositions( state ) ).filter( a => !a.securityItem.description ).map( a => a.securityItem );

    if ( uncompleteSecurities.length > 0 || !data.positions ) {
        yield put( updateAll( uncompleteSecurities, globalSelectors.getStartDate( state ) ) );
    }else{
        yield put( processPortfolio() );
    }
}

function* storeStateSaga ( action ) {

    const state = yield select();
    let { positions = undefined } = action.data ? action.data : {};

    if ( !positions )
        positions = globalSelectors.getPositions( state );

    const data = { positions };
    yield call( StoreService.storePortfolioState, data );

}



function* addSecuritySaga ( action ) {

    yield put( addSecurityToPortfolioStarted() );

    const { security, startDate } = action.data;

    try {
        if ( security ) {

            yield put( showLoader() );

            const item = {
                securityId: security.securityId,
                definition: security
            };
            const newSec = yield* updateSecurityData(item, startDate);

            yield put( addSecurityToPortfolioSucceeded( newSec ) );

            yield put( processPortfolio() );

            yield put( storePortfolioState() );

        }
    } catch ( error ) {
        LogService.error( 'Cannot add security ' + security.securityId, error );
        yield put( addSecurityToPortfolioFailed( 'Cannot add security ' + security.securityId + ', error: ' + error ) );
    }

    yield put( hideLoader() );

}



function* updateAllSaga ( action ) {

    yield put( showMessage( 'Update all data...', 0 ) );
    yield put( showLoader() );
    yield put( updateAllStarted() );

    const { securities, startDate } = action.data;

    try {

        const res = yield* updateSecuritiesData( securities, startDate );

        yield put( updateAllSucceeded( res ) );

        yield put( processPortfolio() );

        yield put( storePortfolioState() );

    } catch ( error ) {
        LogService.error( 'Cannot update all ', error );
        yield put( updateAllFailed( 'Cannot add security ' + ', error: ' + error ) );
        return;
    }

    yield put( showMessage( '', 0 ) );
    yield put( hideLoader() );

}




export function* portfolioManagerRootSaga () {
    yield all( [
        takeEvery( ACTIONS.PORTFOLIO_STATE_RESTORE, restoreStateSaga ),
        takeEvery( ACTIONS.PORTFOLIO_STATE_STORE, storeStateSaga ),
        takeEvery( ACTIONS.PORTFOLIO_SECURITY_ADD, addSecuritySaga ),
        takeEvery( ACTIONS.PORTFOLIO_UPDATE_ALL, updateAllSaga ),
    ] );
}