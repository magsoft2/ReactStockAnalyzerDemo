import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import multi from 'redux-multi';

import { composeWithDevTools } from 'redux-devtools-extension';

import { NODE_ENV } from '../constants';
import {rootSaga} from './rootSagas';
import {combinedReducers} from './reducers';


let composeEnhancers = compose(); 
const sagaMiddleware = createSagaMiddleware();
let middleWares = [ multi, sagaMiddleware ];
if ( NODE_ENV === 'development' ) {

    const loggerMiddleware = createLogger( { collapsed: true } );
    middleWares = [ ...middleWares, loggerMiddleware ];

    composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
    });
}

const store = createStore(
    combinedReducers,
    composeEnhancers(
        applyMiddleware(
            ...middleWares
        )
    )
);
sagaMiddleware.run(rootSaga);


export {store};