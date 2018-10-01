import { delay } from 'redux-saga';
import { put, takeEvery, all, call, select } from 'redux-saga/effects';

import { StoreService, LogService, SecurityService } from 'Services';

import {
    ACTIONS,
    showStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, addSecurityToListStarted, addSecurityToListSucceeded, addSecurityToListFailed,
    updateAll, updateAllStarted, updateAllSucceeded, updateAllFailed
} from './actions';

import { selectors, getSecuritiesSelected } from './reducers';


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

            const [ description, history ] = yield all(
                [ call( SecurityService.getSecurityDescription, security.securityId ),
                call( getSecurityHistory, security.securityId, security.group, startDate ) ] );

            yield put( addSecurityToListSucceeded( security, history, description ) );

            yield put( storeStockAnalysisState() );

        }
    } catch ( error ) {
        LogService.error( 'Cannot add security ' + security.securityId, error );
        yield put( addSecurityToListFailed( 'Cannot add security ' + security.securityId + ', error: ' + error ) );
        return;
    }
}

function* updateAllSaga ( action ) {

    yield put( updateAllStarted() );

    const { securities, startDate } = action.data;

    try {

        yield delay(5000);
        // if ( security ) {

        //     const [ description, history ] = yield all(
        //         [ call( SecurityService.getSecurityDescription, security.securityId ),
        //         call( getSecurityHistory, security.securityId, security.group, startDate ) ] );

        yield put( updateAllSucceeded( ) );

        yield put( storeStockAnalysisState() );

    } catch ( error ) {
        LogService.error( 'Cannot update all ', error );
        yield put( updateAllFailed( 'Cannot add security ' + ', error: ' + error ) );
        return;
    }
}

const getSecurityHistory = async ( securityId, securityGroup, startDate ) => {

    const resHist = await SecurityService.getSecurityHistory( securityId, securityGroup, startDate );

    return {
        securityId: securityId,
        candles: resHist
    };
};

/*
const findItemByIdInList = ( id, list ) => {

    if ( list && list.length ) {
        let item = list.filter( a => a.securityId == id );
        if ( item && item.length ) {
            return item[ 0 ];
        }
    }

    return undefined;
};

const loadAllData = async ( securities, startDate, forceUpdate = false ) => {
    if ( !securities || !securities.length )
        return securities;

    for ( const item of securities ) {

        const description = item.description && !forceUpdate ? item.description : await SecurityService.getSecurityDescription( item.securityId );
        const history = item.history && !forceUpdate ? item.history : await this.getSecurityHistory( item.securityId, item.definition.group, startDate );
        //TEMP! optimize it. 

        this.updateOrAddItemToList( securities, item.definition, history, description );
    }

    return securities;
};

const updateOrAddItemToList = ( list, itemNew, history, description ) => {

    if ( !itemNew )
        return list;

    let item = this.findItemByIdInList( itemNew.securityId, list );
    if ( !item ) {
        item = {
            securityId: itemNew.securityId
        };
        list.unshift( item );
    }
    item.definition = itemNew;
    item.history = history ? history : item.history;
    item.description = description ? description : item.description;

    return list;
};
*/

export function* securityAnalysisRootSaga () {
    yield all( [
        takeEvery( ACTIONS.STOCKANALYSIS_STATE_RESTORE, restoreState ),
        takeEvery( ACTIONS.STOCKANALYSIS_STATE_STORE, storeState ),
        takeEvery( ACTIONS.STOCKANALYSIS_SECURITY_ADD, addSecurity ),
        takeEvery( ACTIONS.STOCKANALYSIS_UPDATE_ALL, updateAllSaga ),
    ] );
}