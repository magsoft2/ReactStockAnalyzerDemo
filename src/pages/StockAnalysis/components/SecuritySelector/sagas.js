import { delay } from "redux-saga";
import { put, take, takeEvery, call, all, cancel, fork, takeLatest } from "redux-saga/effects";

import { ACTIONS, startSecuritySearch, showSecuritySuggestions, securitySearchFailed } from "./actions";
import { showLoader, hideLoader } from 'components/Loader';

import { SecurityService, CacheService, LogService } from "Services";


export function* securitySearchFunc(action) {
    try {
        const key = action.text;

        const suggestions = yield CacheService.getOrAdd(key, function*() {

            try {
                yield delay(100);

                yield put(showLoader());
                yield put(startSecuritySearch());

                const suggestions = yield call(SecurityService.findSecurity, action.text);

                return suggestions;
                
            } catch (err) {
                yield put(hideLoader());
                yield put(securitySearchFailed(err));
            }

        });

        yield put(hideLoader());
        yield put(
            showSecuritySuggestions({
                suggestionsList: suggestions
            })
        );
    } catch (err) {
        yield put(hideLoader());
        yield put(securitySearchFailed(err));
    }
}

export function* securitySearchSagaRootSaga() {
    yield takeLatest(ACTIONS.SECURITY_SEARCH, securitySearchFunc);
}
