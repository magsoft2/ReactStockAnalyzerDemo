import { ACTIONS } from './actions';

const initialState = {
    showLoader: false
};

const loaderState = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.GLOBAL_LOADER_SHOW:
            return {
                ...state,
                showLoader: true
            };
        case ACTIONS.GLOBAL_LOADER_HIDE:
            return {
                ...state,
                showLoader: false
            };
        default:
            return state;
    }
};

export const getLoaderShownState = ( state ) => state.loaderState.showLoader;

export { loaderState };