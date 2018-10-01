import { delay } from 'redux-saga';
import { put, takeEvery, all, call, select } from 'redux-saga/effects';

import { StoreService, LogService, SecurityService } from 'Services';

import {
    ACTIONS, 
    showStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, addSecurityToListStarted, addSecurityToListSucceeded, addSecurityToListFailed
} from './actions';


function* restoreState () {

    const { securities = undefined, indicators = [] } = yield call( StoreService.restoreStockAnalysisState );

    if ( securities ) {
        LogService.log( 'StockAnalysis: project state was initialized from store' );
    }

    const data = {
        securities,
        indicators
    };

    yield put( showStockAnalysisState( data ) );
}

function* storeState ( action ) {

    const state = yield select();
    let {securities = undefined, indicators = undefined} = action.data;

    if(!securities)
        securities = state.securities;
    if(!indicators)
        indicators = state.indicators;

    const data = {securities, indicators};
    yield call( StoreService.storeStockAnalysisState, data );

}



function* addSecurity ( action ) {

    yield put( addSecurityToListStarted() );

    const { security, securities, startDate } = action.data;

    try {
        if ( security && securities ) {

            if ( securities && securities.length > 20 ) {
                yield put( addSecurityToListFailed( 'cannot add more than 20 securities to list' ) );
                return;
            }

            const [ description, history ] = yield all(
                [ call( SecurityService.getSecurityDescription, security.securityId ),
                call( getSecurityHistory, security.securityId, security.group, startDate ) ] );


            const item = {
                securityId: security.securityId,
                selected: true
            };
            item.definition = security;
            item.history = history ? history : item.history;
            item.description = description ? description : item.description;

            const index = securities.findIndex( it => it.securityId === security.securityId );
            if ( index >= 0 ) {
                securities.splice( index, 1, item );
            } else {
                securities.unshift( item );
            }

            securities.map( a => a.securityId != security.securityId ? a.selected = false : '' );

            yield put( addSecurityToListSucceeded( securities ) );

            //yield put(storeStockAnalysisState( {securities}));

        }
    } catch ( error ) {
        LogService.error( 'Cannot add security ' + security.securityId, error );
        yield put( addSecurityToListFailed( 'Cannot add security ' + security.securityId + ', error: ' + error ) );
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
    ] );
}