
export const ACTIONS = { INITIALIZE_COMPLETED: 'ACTION.INITIALIZE.COMPLETED' };

export const setInitializedState = (references) => {
    return { type: ACTIONS.INITIALIZE_COMPLETED, data: {references} };
};