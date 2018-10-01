
const ACTIONS = {
    STOCKANALYSIS_STATE_RESTORE: 'STOCKANALYSIS.STATE.RESTORE',
    STOCKANALYSIS_STATE_RESTORE_SUCCEEDED: 'STOCKANALYSIS.STATE.RESTORE.SUCCEEDED',

    STOCKANALYSIS_STATE_STORE: 'STOCKANALYSIS.STATE.STORE',
    STOCKANALYSIS_STATE_STORE_SUCCEEDED: 'STOCKANALYSIS.STATE.STORE.SUCCEEDED',

    STOCKANALYSIS_SECURITY_ADD: 'STOCKANALYSIS.SECURITY.ADD',
    STOCKANALYSIS_SECURITY_ADD_STARTED: 'STOCKANALYSIS.SECURITY.ADD.STARTED',
    STOCKANALYSIS_SECURITY_ADD_FAILED: 'STOCKANALYSIS.SECURITY.ADD.FAILED',
    STOCKANALYSIS_SECURITY_ADD_SUCCEEDED: 'STOCKANALYSIS.SECURITY.ADD.SUCCEEDED',

    STOCKANALYSIS_SECURITY_DELETE: 'STOCKANALYSIS.SECURITY.DELETE',
    STOCKANALYSIS_SECURITY_CHECK: 'STOCKANALYSIS.SECURITY.CHECK',

    STOCKANALYSIS_INDICATOR_ADD: 'STOCKANALYSIS.INDICATOR.ADD',
    STOCKANALYSIS_INDICATOR_DELETE: 'STOCKANALYSIS.INDICATOR.DELETE',

    STOCKANALYSIS_UPDATE_ALL: 'STOCKANALYSIS.UPDATE_ALL',
    STOCKANALYSIS_UPDATE_ALL_STARTED: 'STOCKANALYSIS.UPDATE_ALL.STARTED',
    STOCKANALYSIS_UPDATE_ALL_ADD_SUCCEEDED: 'STOCKANALYSIS.UPDATE_ALL.SUCCEEDED',
    STOCKANALYSIS_UPDATE_ALL_ADD_FAILED: 'STOCKANALYSIS.UPDATE_ALL.FAILED',
};

const restoreStockAnalysisState = () => {
    return { type: ACTIONS.STOCKANALYSIS_STATE_RESTORE };
};
const storeStockAnalysisState = (data) => {
    return { type: ACTIONS.STOCKANALYSIS_STATE_STORE, data };
};
const showStockAnalysisState = (data) => {
    return { type: ACTIONS.STOCKANALYSIS_STATE_RESTORE_SUCCEEDED, data };
};

const addSecurityToList = (security, startDate) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD, data: {security, startDate} };
};
const addSecurityToListStarted = () => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD_STARTED };
};
const addSecurityToListSucceeded = (security, history, description) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD_SUCCEEDED, data: {security, history, description}  };
};
const addSecurityToListFailed = (error) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD_FAILED, error };
};
const deleteSecurityFromList = (id, securities) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_DELETE, data: {id, securities} };
};
const checkSecurity = (id, securities) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_CHECK, data: {id, securities} };
};
const addIndicator = (indicator) => {
    return { type: ACTIONS.STOCKANALYSIS_INDICATOR_ADD, data: {indicator} };
};
const deleteIndicator = (key) => {
    return { type: ACTIONS.STOCKANALYSIS_INDICATOR_DELETE, data: {key} };
};
const updateAll = (securities, startDate) => {
    return { type: ACTIONS.STOCKANALYSIS_UPDATE_ALL, data: {securities, startDate} };
};
const updateAllStarted = () => {
    return { type: ACTIONS.STOCKANALYSIS_UPDATE_ALL_STARTED };
};
const updateAllSucceeded = (securities) => {
    return { type: ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_SUCCEEDED, data: {securities} };
};
const updateAllFailed = (error) => {
    return { type: ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_FAILED, data: {error} };
};

export {
    ACTIONS, 
    restoreStockAnalysisState, storeStockAnalysisState, showStockAnalysisState,
    addSecurityToList, addSecurityToListStarted, addSecurityToListSucceeded, addSecurityToListFailed,
    deleteSecurityFromList, checkSecurity,
    addIndicator, deleteIndicator,
    updateAll, updateAllStarted, updateAllSucceeded, updateAllFailed
};