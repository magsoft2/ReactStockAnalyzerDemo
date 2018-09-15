"use strict";
import React from "react";
import {render} from "react-dom";
import {createStore, combineReducers, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger'
import {Router, Route, browserHistory} from "react-router";
import {syncHistoryWithStore, routerReducer} from "react-router-redux";
import {transform, debounce} from 'lodash';
import compose from "redux/es/compose";
import persistState from 'redux-localstorage'
import {createResponsiveStateReducer, calculateResponsiveState} from 'redux-responsive';

import AppContainer from "containers/AppContainer";
import {
    TestPage,
	NotFoundPage
} from "pages";

import {NODE_ENV, BREAKPOINTS, ROUTES} from "./constants";
import CONFIG from 'config';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({
    collapsed: true,
});
let middleWares = [sagaMiddleware];
if(NODE_ENV === 'development'){
    middleWares = [...middleWares, loggerMiddleware]
}

const store = createStore(
    combineReducers({
        routing: routerReducer,
        browser: createResponsiveStateReducer(BREAKPOINTS, {
            extraFields: ({ lessThan, is }) => ({
                lessThanOrEqual: transform(lessThan, (result, value, mediaType) => {
                    result[mediaType] = value || is[mediaType]
                }, {})
            }),
        })
    }),
    composeEnhancers(
        applyMiddleware(
            ...middleWares
        ),
        // persistState() //uncomment it when we will done with refactor
    )
);
//sagaMiddleware.run(rootSaga);

const history = syncHistoryWithStore(browserHistory, store);
export const action = type => store.dispatch({type});

const fireTracing = () => {
    //@TODO move this line out from here
    //window.scrollTo(0, 0);
};

render(
    <Provider store={store}>
            <Router onUpdate={() => fireTracing()} history={history}>
                <Route path="/" component={AppContainer}>
                    <Route path="/test" component={TestPage}/>
                </Route>
                <Route path="**" component={NotFoundPage} />
            </Router>
    </Provider>,
    document.getElementById("app")
);