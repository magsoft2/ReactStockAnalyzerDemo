import { createSelector } from 'reselect';

import { globalizeSelectors, fromRoot } from 'utils';



const getPositions = ( state ) => state ? state.positions : [];
const getStartDate = ( state ) => state.startDate;
const getPortfolioCalculatedData = (state, fieldName = undefined) => {
    return getCalculatedData(state, fieldName);
};
const getReferenceData = (state) => state.referenceData;
const getFactors = (state) => state.factors;
const getCalculatedData = (position, fieldName = undefined) => {
    
    if(!position)
        return undefined;

    if(!fieldName)
        return position.calculatedData;

    if(position.calculatedData) {
        return position.calculatedData[fieldName];
    }

    return undefined;
};

const getSecuritySelectedById = createSelector(
    ( state, securityId ) => { return { suggestions: getPositions( state ), securityId }; },
    ( obj ) => {
        const { suggestions, securityId } = obj;
        return suggestions.find( a => a.securityId === securityId );
    }
);


export const selectors = {
    getPositions,
    getSecuritySelectedById,
    getStartDate,
    getFactors,
    getCalculatedData,
    getPortfolioCalculatedData,
    getReferenceData
};

export const globalSelectors = globalizeSelectors( selectors, 'portfolio' );