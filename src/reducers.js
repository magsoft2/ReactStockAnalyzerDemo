import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {suggestions} from 'pages/StockAnalysis/components/SecuritySelector';
import {securitiesAnalysis} from 'pages/StockAnalysis';
import {notifications} from 'components/GlobalNotification';

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

const getReferences = (state) => state.references;

const getSecurityTypeReference = createSelector(
    (state, securityTypeId) => { return { references: getReferences(state), securityTypeId}; },
    ( obj ) => {
        const {references, securityTypeId} = obj;
        return references.securityTypes.find(a => a.typeName === securityTypeId);
    }
);


const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions,
    references,
    notifications
} );

export {combinedReducers, getReferences, getSecurityTypeReference};