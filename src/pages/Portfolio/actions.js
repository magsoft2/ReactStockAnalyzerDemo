
const ACTIONS = {
    PORTFOLIO_STATE_RESTORE: 'PORTFOLIO.STATE.RESTORE',
    PORTFOLIO_STATE_RESTORE_SUCCEEDED: 'PORTFOLIO.STATE.RESTORE.SUCCEEDED',

    PORTFOLIO_STATE_STORE: 'PORTFOLIO.STATE.STORE',
    PORTFOLIO_STATE_STORE_SUCCEEDED: 'PORTFOLIO.STATE.STORE.SUCCEEDED',

    PORTFOLIO_SECURITY_ADD: 'PORTFOLIO.SECURITY.ADD',
    PORTFOLIO_SECURITY_ADD_STARTED: 'PORTFOLIO.SECURITY.ADD.STARTED',
    PORTFOLIO_SECURITY_ADD_FAILED: 'PORTFOLIO.SECURITY.ADD.FAILED',
    PORTFOLIO_SECURITY_ADD_SUCCEEDED: 'PORTFOLIO.SECURITY.ADD.SUCCEEDED',

    PORTFOLIO_SECURITY_DELETE: 'PORTFOLIO.SECURITY.DELETE',

    PORTFOLIO_POSITION_EDIT: 'PORTFOLIO.POSITION.EDIT',

    PORTFOLIO_CALCULATE_ALL: 'PORTFOLIO.CALCULATE.ALL',

    PORTFOLIO_UPDATE_ALL: 'PORTFOLIO.UPDATE_ALL',
    PORTFOLIO_UPDATE_ALL_STARTED: 'PORTFOLIO.UPDATE_ALL.STARTED',
    PORTFOLIO_UPDATE_ALL_ADD_SUCCEEDED: 'PORTFOLIO.UPDATE_ALL.SUCCEEDED',
    PORTFOLIO_UPDATE_ALL_ADD_FAILED: 'PORTFOLIO.UPDATE_ALL.FAILED',
};

const restorePortfolioState = () => {
    return { type: ACTIONS.PORTFOLIO_STATE_RESTORE };
};
const storePortfolioState = (data) => {
    return { type: ACTIONS.PORTFOLIO_STATE_STORE, data };
};
const showPortfolioState = (data) => {
    return { type: ACTIONS.PORTFOLIO_STATE_RESTORE_SUCCEEDED, data };
};

const addSecurityToPortfolio = (security, startDate) => {
    return { type: ACTIONS.PORTFOLIO_SECURITY_ADD, data: {security, startDate} };
};
const addSecurityToPortfolioStarted = () => {
    return { type: ACTIONS.PORTFOLIO_SECURITY_ADD_STARTED };
};
const addSecurityToPortfolioSucceeded = (security) => {
    return { type: ACTIONS.PORTFOLIO_SECURITY_ADD_SUCCEEDED, data: {security}  };
};
const addSecurityToPortfolioFailed = (error) => {
    return { type: ACTIONS.PORTFOLIO_SECURITY_ADD_FAILED, error };
};
const deleteSecurityFromPortfolio = (idx) => {
    return [
        { type: ACTIONS.PORTFOLIO_SECURITY_DELETE, data: {idx} },
        { type: ACTIONS.PORTFOLIO_CALCULATE_ALL }
    ];
};
const editPortfolioPosition = (idx, newPosition) => {
    return [
        { type: ACTIONS.PORTFOLIO_POSITION_EDIT, data: {idx, newPosition} },
        { type: ACTIONS.PORTFOLIO_CALCULATE_ALL }
    ];
};
const updateAll = (securities, startDate) => {
    return { type: ACTIONS.PORTFOLIO_UPDATE_ALL, data: {securities, startDate} };
};
const updateAllStarted = () => {
    return { type: ACTIONS.PORTFOLIO_UPDATE_ALL_STARTED };
};
const updateAllSucceeded = (securities) => {
    return { type: ACTIONS.PORTFOLIO_UPDATE_ALL_ADD_SUCCEEDED, data: {securities} };
};
const updateAllFailed = (error) => {
    return { type: ACTIONS.PORTFOLIO_UPDATE_ALL_ADD_FAILED, data: {error} };
};
const processPortfolio = (data) => {
    return { type: ACTIONS.PORTFOLIO_CALCULATE_ALL, data };
};

export {
    ACTIONS, 
    restorePortfolioState, storePortfolioState, showPortfolioState,
    addSecurityToPortfolio, addSecurityToPortfolioStarted, addSecurityToPortfolioSucceeded, addSecurityToPortfolioFailed,
    deleteSecurityFromPortfolio, editPortfolioPosition,
    processPortfolio,
    updateAll, updateAllStarted, updateAllSucceeded, updateAllFailed
};