import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import multi from 'redux-multi';

import { composeWithDevTools } from 'redux-devtools-extension';

import { NODE_ENV } from '../constants';
import {rootSaga} from './rootSagas';
import {combinedReducers} from './reducers';


const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger( { collapsed: true } );
let middleWares = [ multi, sagaMiddleware ];
if ( NODE_ENV === 'development' ) {
    middleWares = [ ...middleWares, loggerMiddleware ];
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