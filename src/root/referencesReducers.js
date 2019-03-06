import { createSelector } from 'reselect';


import { DefaultCollections } from 'domain/defaultCollections';

import { ACTIONS } from './actions';

const initialReferenceState = {
    indexes: DefaultCollections.createDefaultIndexList()
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
const getIndexes = (state) => getReferences(state).indexes;

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


export {references, getReferences, getSecurityTypeReference, getIndexListReference};