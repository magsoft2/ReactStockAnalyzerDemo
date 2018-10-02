import { combineReducers } from 'redux';

import {suggestions} from 'pages/StockAnalysis/components/SecuritySelector';
import {securitiesAnalysis} from 'pages/StockAnalysis';

export const ACTIONS = { INITIALIZE_COMPLETED: 'ACTION.INITIALIZE.COMPLETED' };



const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions
} );

export default combinedReducers;