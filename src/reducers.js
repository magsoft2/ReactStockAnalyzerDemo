import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import {notifications} from 'components/GlobalNotification';
import {suggestions} from 'components/SecuritySelector';
import {securitiesAnalysis} from 'pages/StockAnalysis';
import {portfolio} from 'pages/Portfolio';

import {createDefaultIndexList} from 'domain/securityHelpers';


export const ACTIONS = { INITIALIZE_COMPLETED: 'ACTION.INITIALIZE.COMPLETED' };

const initialReferenceState = {
    indexes: createDefaultIndexList()
};

const references = ( state = initialReferenceState, action ) => {
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
const getIndexListReference = createSelector(
    (state) => getReferences(state),
    ( obj ) => {
        return obj ? obj.indexes: [];
    }
);


const combinedReducers = combineReducers( {
    securitiesAnalysis,
    suggestions,
    references,
    notifications,
    portfolio
} );

export {combinedReducers, getReferences, getSecurityTypeReference, getIndexListReference};