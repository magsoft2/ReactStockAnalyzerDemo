
const ACTIONS = {
    SECURITY_SEARCH: 'SECURITY_SEARCH',
    SECURITY_SEARCH_STARTED: 'SECURITY_SEARCH.STARTED',
    SECURITY_SEARCH_SUCCEEDED: 'SECURITY_SEARCH.SUCCEEDED',
    SECURITY_SEARCH_FAILED: 'SECURITY_SEARCH.FAILED'
};


const searchSecurityAsync = (text) => {
    return { type: ACTIONS.SECURITY_SEARCH, text };
};
const startSecuritySearch = () => {
    return { type: ACTIONS.SECURITY_SEARCH_STARTED };
};
const showSecuritySuggestions = (data) => {
    return { type: ACTIONS.SECURITY_SEARCH_SUCCEEDED, data };
};
const securitySearchFailed = (error) => {
    return { type: ACTIONS.SECURITY_SEARCH_FAILED, error };
};

export { ACTIONS, searchSecurityAsync, startSecuritySearch, showSecuritySuggestions, securitySearchFailed };