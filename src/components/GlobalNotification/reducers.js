import { ACTIONS } from './actions';

const initialState = {
    showLoader: false,
    message: '',
    progressTick: 0,
    notifications: []
};

//TODO: track stack/number of showLoader calls ?

const notifications = ( state = initialState, action ) => {
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

        case ACTIONS.GLOBAL_MESSAGE_SHOW:
            return {
                ...state,
                message: action.message,
                progressTick: action.progressTick !==- 1 ? action.progressTick : state.progressTick
            };
        case ACTIONS.GLOBAL_PROGRESS_CHANGE:
            return {
                ...state,
                progressTick: action.progressTick
            };

        default:
            return state;
    }
};

export const getLoaderShownState = ( state ) => state.notifications.showLoader;
export const getProgressTick = ( state ) => state.notifications.progressTick;
export const getMessage = ( state ) => state.notifications.message;
export const getNotifications = ( state ) => state.notifications.notifications;

export { notifications };