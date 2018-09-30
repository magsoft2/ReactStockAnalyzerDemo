
const ACTIONS = {
    STOCKANALYSIS_STATE_RESTORE: 'STOCKANALYSIS_STATE_RESTORE',
    STOCKANALYSIS_STATE_RESTORE_SUCCEEDED: 'STOCKANALYSIS_STATE_RESTORE_SUCCEEDED',

    STOCKANALYSIS_STATE_STORE: 'STOCKANALYSIS_STATE_STORE',
    STOCKANALYSIS_STATE_STORE_SUCCEEDED: 'STOCKANALYSIS_STATE_STORE_SUCCEEDED',

    STOCKANALYSIS_SECURITY_ADD: 'STOCKANALYSIS_SECURITY_ADD',
    STOCKANALYSIS_SECURITY_ADD_STARTED: 'STOCKANALYSIS_SECURITY_ADD_STARTED',
    STOCKANALYSIS_SECURITY_ADD_FAILED: 'STOCKANALYSIS_SECURITY_ADD_FAILED',
    STOCKANALYSIS_SECURITY_ADD_SUCCEEDED: 'STOCKANALYSIS_SECURITY_ADD_SUCCEEDED',

    STOCKANALYSIS_SECURITY_DELETE: 'STOCKANALYSIS_SECURITY_DELETE',
    STOCKANALYSIS_SECURITY_CHECK: 'STOCKANALYSIS_SECURITY_CHECK',
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

const addSecurityToList = (security, securities, startDate) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD, data: {security, securities, startDate} };
};
const addSecurityToListStarted = () => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD_STARTED };
};
const addSecurityToListSucceeded = (securities) => {
    return { type: ACTIONS.STOCKANALYSIS_SECURITY_ADD_SUCCEEDED, data: {securities}  };
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

export {
    ACTIONS, 
    restoreStockAnalysisState, storeStockAnalysisState, showStockAnalysisState,
    addSecurityToList, addSecurityToListStarted, addSecurityToListSucceeded, addSecurityToListFailed,
    deleteSecurityFromList, checkSecurity
};