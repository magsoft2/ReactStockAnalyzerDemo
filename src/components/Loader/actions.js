
export const ACTIONS = {
    GLOBAL_LOADER_SHOW: 'GLOBAL.LOADER.SHOW',
    GLOBAL_LOADER_HIDE: 'GLOBAL.LOADER.HIDE',
};

export const showLoader = () => ( { type: ACTIONS.GLOBAL_LOADER_SHOW } );
export const hideLoader = () => ( { type: ACTIONS.GLOBAL_LOADER_HIDE } );
