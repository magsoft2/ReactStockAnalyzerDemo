import React from "react";
import {render} from "react-dom";
import {createStore, combineReducers, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import compose from "redux/es/compose";

import AppLayoutContainer from "./components/AppLayoutContainer";
import {
    StockAnalysisPage,
    PortfolioManagementPage,
    AboutPage,
	NotFoundPage
} from "./pages"

import {NODE_ENV} from "./constants";
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
//sagaMiddleware.run(rootSaga);

const store = createStore(
    composeEnhancers(
        applyMiddleware(
            ...middleWares
        )
    )
);

render(
    (<Provider store={store}>
        <Router basename={CONFIG.publicPath}>
            <Switch>
                <AppLayoutContainer>
                    <Switch>
                        <Route path="/" exact={true} component={StockAnalysisPage} />
                        <Route path="/portfolio" component={PortfolioManagementPage} />
                        <Route path="/about" component={AboutPage} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </AppLayoutContainer>
            </Switch>
        </Router> 
    </Provider>),
    document.getElementById("app")
);