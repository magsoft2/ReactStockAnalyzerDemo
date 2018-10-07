
export const ACTIONS = {
    GLOBAL_LOADER_SHOW: 'GLOBAL.LOADER.SHOW',
    GLOBAL_LOADER_HIDE: 'GLOBAL.LOADER.HIDE',

    GLOBAL_MESSAGE_SHOW: 'GLOBAL.MESSAGE.SHOW',
    GLOBAL_PROGRESS_CHANGE: 'GLOBAL.PROGRESS.CHANGE',
};

export const showLoader = () => ( { type: ACTIONS.GLOBAL_LOADER_SHOW } );
export const hideLoader = () => ( { type: ACTIONS.GLOBAL_LOADER_HIDE } );

export const showMessage = (message, progressTick = -1) => ( { type: ACTIONS.GLOBAL_MESSAGE_SHOW, message, progressTick } );
export const setProgress = (progress) => ( { type: ACTIONS.GLOBAL_PROGRESS_CHANGE, progressTick } );
