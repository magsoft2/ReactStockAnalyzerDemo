import { delay } from 'redux-saga';
import { put, take, takeEvery, call, all, cancel, fork, takeLatest } from 'redux-saga/effects';


import { ACTIONS, startSecuritySearch, showSecuritySuggestions, securitySearchFailed } from './actions';

import { SecurityService } from 'Services';


export function* securitySearchFunc ( action ) {
    try {

        yield delay( 300 );

        yield put( startSecuritySearch() );

        const suggestions = yield call( SecurityService.findSecurity, action.text );

        yield put( showSecuritySuggestions( {
            suggestionsList: suggestions
        } ) );
    }
    catch ( err ) {
        yield put( securitySearchFailed( err ) );
    }
}

export function* securitySearchSaga () {
    yield takeLatest( ACTIONS.SECURITY_SEARCH, securitySearchFunc );
}

