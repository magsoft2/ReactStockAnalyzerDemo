import { createSelector } from 'reselect';

import { ACTIONS } from './actions';

const initialState = {
    securitiesSuggestionsList: []
};

const suggestions = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.SECURITY_SEARCH_STARTED:
            return state;
        case ACTIONS.SECURITY_SEARCH_SUCCEEDED:
            return {
                ...state,
                securitiesSuggestionsList: action.data.suggestionsList
            };
        case ACTIONS.SECURITY_SEARCH_FAILED:
            return {
                ...state,
                securitiesSuggestionsList: []
            };
        default:
            return state;
    }
};


export const getSecuritiesSuggestionsList = ( state ) => state.suggestions.securitiesSuggestionsList;


export const getSecuritiesSuggestionsMap = createSelector(
    [ getSecuritiesSuggestionsList ],
    ( suggestions ) => {

        const map = new Map();
        for ( let item of suggestions ) {
            if ( !map.has( item.type ) )
                map.set( item.type, [] );

            map.get( item.type ).push( item );
        }

        return Array.from( map );
    }
);

export { suggestions };