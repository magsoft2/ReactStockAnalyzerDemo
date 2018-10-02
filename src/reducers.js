import { combineReducers } from 'redux';

import {suggestions} from 'pages/StockAnalysis/components/SecuritySelector';
import {securitiesAnalysis} from 'pages/StockAnalysis';

export const ACTIONS = { INITIALIZE_COMPLETED: 'ACTION.INITIALIZE.COMPLETED' };

const references = ( state = null, action ) => {
    switch ( action.type ) {
        case ACTIONS.INITIALIZE_COMPLETED:
            return {
                ...state,
                ...action.data.references
            };
        default:
            return state;
    }
};

const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions,
    references
} );

export default combinedReducers;