import {delay} from 'redux-saga';
import { put, takeEvery, all } from 'redux-saga/effects';

import {incrementAsync, showNotification, hideNotification} from 'actions';


let nextNotificationId = 0;

function* incrementFunc (action) {
    const id = nextNotificationId++;
    yield put(showNotification(id, action));
    yield delay(10000);
    yield put(hideNotification(id));
}

function* incrementSaga () {
    yield takeEvery('INCREMENT_ASYNC', incrementFunc);
}

const USER_FETCH_SUCCESS = 'USER_FETCH_SUCCESS';
const USER_FETCH_FAILED = 'USER_FETCH_FAILED';

function* fetchUser(action) {
    try {
        const url = `http://foo/user/${action.payload}`;
        // const user = yield axios.get(url);
        // yield put({ type: USER_FETCH_SUCCESS,
        //     payload: user.data });
    }
    catch(err) {
        yield put({ type: USER_FETCH_FAILED,
            payload: err,
            error: true });
    }
}

export function* rootSaga () {
    yield [
        incrementSaga()
    ];
}