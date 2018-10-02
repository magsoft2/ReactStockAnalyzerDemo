import { delay } from "redux-saga";
import { put, take, takeEvery, call, all, cancel, fork, takeLatest } from "redux-saga/effects";

import { ACTIONS, startSecuritySearch, showSecuritySuggestions, securitySearchFailed } from "./actions";

import { SecurityService, CacheService, LogService } from "Services";


export function* securitySearchFunc(action) {
    try {
        const key = action.text;

        const suggestions = yield CacheService.getOrAdd(key, function*() {
            
            try {
                yield delay(300);

                yield put(startSecuritySearch());

                const suggestions = yield call(SecurityService.findSecurity, action.text);

                return suggestions;
            } catch (err) {
                yield put(securitySearchFailed(err));
            }

        });

        const descriptions = yield CacheService.getOrAdd('get_all_descriptions', function*() {
            
            try {
                const descr = yield SecurityService.getAllReferences();
                return descr;
            } catch (err) {
                //yield put(securitySearchFailed(err));
                LogService.error('getting all descriptions error, ', err);
            }

        });

        yield put(
            showSecuritySuggestions({
                suggestionsList: suggestions,
                descriptions
            })
        );
    } catch (err) {
        yield put(securitySearchFailed(err));
    }
}

export function* securitySearchSagaRootSaga() {
    yield takeLatest(ACTIONS.SECURITY_SEARCH, securitySearchFunc);
}
