import { combineReducers } from 'redux';

import {notifications} from 'components/GlobalNotification';
import {suggestions} from 'components/SecuritySelector';
import {securitiesAnalysis} from 'pages/StockAnalysis';
import {portfolio} from 'pages/Portfolio';
import {references} from './referencesReducers';



const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions,
    references,
    notifications,
    portfolio
} );

export {combinedReducers};