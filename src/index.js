import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import compose from 'redux/es/compose';
import createSagaMiddleware, {delay} from 'redux-saga';

import { put, takeEvery, all } from 'redux-saga/effects';

import AppLayoutContainer from './components/AppLayoutContainer';
import {
    StockAnalysisPage,
    PortfolioManagementPage,
    AboutPage,
    NotFoundPage
} from './pages';

import { NODE_ENV } from './constants';
import CONFIG from 'config';


//1. actions
import {incrementAsync, showNotification, hideNotification} from 'actions';

//2. sagas
//import { incrementAsync } from './actions'
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
export function* rootSaga () {
    yield [
        incrementSaga()
    ];
}
//3. reducers
const notifications = (state = [], action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return [...state, { id: action.id, text: action.text }];
        case 'HIDE_NOTIFICATION':
            return state.filter((notification) => { return notification.id !== action.id });
        default:
            return state;
    }
};
export const combinedReducers = combineReducers({
    notifications
});


//4. create store, middlewares
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger( { collapsed: true } );
let middleWares = [ sagaMiddleware ];
if ( NODE_ENV === 'development' ) {
    middleWares = [ ...middleWares, loggerMiddleware ];
}

const store = createStore(
    //composeEnhancers(
        combinedReducers, //import it from reducers
        applyMiddleware(
            ...middleWares
        )
    //)
);
sagaMiddleware.run(rootSaga);


render(
    ( <Provider store={ store }>
        <Router basename={ CONFIG.publicPath }>
            <Switch>
                <AppLayoutContainer>
                    <Switch>
                        <Route path="/" exact={ true } component={ StockAnalysisPage } />
                        <Route path="/portfolio" component={ PortfolioManagementPage } />
                        <Route path="/about" component={ AboutPage } />
                        <Route path="*" component={ NotFoundPage } />
                    </Switch>
                </AppLayoutContainer>
            </Switch>
        </Router>
    </Provider> ),
    document.getElementById( 'app' )
);