import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import compose from 'redux/es/compose';
import createSagaMiddleware from 'redux-saga';

import AppLayoutContainer from './components/AppLayoutContainer';
import {
    StockAnalysisPage,
    PortfolioManagementPage,
    AboutPage,
    NotFoundPage
} from './pages';

import { NODE_ENV } from './constants';
import CONFIG from 'config';

import {rootSaga} from 'sagas';
import combinedReducers from 'reducers';



const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger( { collapsed: true } );
let middleWares = [ sagaMiddleware ];
if ( NODE_ENV === 'development' ) {
    middleWares = [ ...middleWares, loggerMiddleware ];
}

const store = createStore(
    //composeEnhancers(
    combinedReducers,
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