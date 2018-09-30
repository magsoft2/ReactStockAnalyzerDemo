
import {ACTIONS} from './actions';

const initialState = {
    securitiesSuggestionsMap:[],
    securitiesSuggestionsList: [],
    isLoading: false
};

const suggestions = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.SECURITY_SEARCH_STARTED:
            return { 
                ...state, 
                isLoading: true
            };
        case ACTIONS.SECURITY_SEARCH_SUCCEEDED:
            return {
                ...state, 
                isLoading: false,
                securitiesSuggestionsMap: action.data.suggestionsMap,
                securitiesSuggestionsList: action.data.suggestionsList
            };
        case ACTIONS.SECURITY_SEARCH_FAILED:
            return {
                ...state, 
                isLoading: false,
                securitiesSuggestionsMap: [],
                securitiesSuggestionsList: []
            };
        default:
            return state;
    }
};

export {suggestions};