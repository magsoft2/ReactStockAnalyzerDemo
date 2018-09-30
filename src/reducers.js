import { combineReducers } from 'redux';

import {suggestions} from 'pages/StockAnalysis/components/SecuritySelector/reducers';
import {securitiesAnalysis} from 'pages/StockAnalysis/reducers';



const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions
} );

export default combinedReducers;