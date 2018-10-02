import moment from 'moment';
import {createSelector } from 'reselect';

import CONSTANTS from 'constants';
import { globalizeSelectors, fromRoot } from 'utils';

import { ACTIONS } from './actions';


const defaultDefinition = {
    securityId: 'GAZP',
    name: 'GAZP',
    group: 'stock_shares'
};

const initialState = {
    securities: [
        {
            securityId: defaultDefinition.securityId,
            selected: true,
            definition: defaultDefinition,
            history: undefined,
            description: undefined
        }
    ],
    indicators: [],

    isLoading: false,

    startDate: moment().add( -1, 'years' ).format( CONSTANTS.dateFormat ),
};


const securitiesAnalysis = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.STOCKANALYSIS_STATE_RESTORE_SUCCEEDED:
            return {
                ...state,
                isLoading: false,
                ...action.data
            };

        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_STARTED:
            return {
                ...state,
                isLoading: true,
                error: undefined
            };
        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_SUCCEEDED: {

            const { security, history, description } = action.data;

            return addSecurityToList( security, history, description, state );
        }
        case ACTIONS.STOCKANALYSIS_SECURITY_DELETE: {

            let { id } = action.data;
            const securities = getSecuritiesSelected( state );

            return deleteSecurityFromList( securities, id, state );
        }
        case ACTIONS.STOCKANALYSIS_SECURITY_CHECK: {

            const { id } = action.data;

            const securities = getSecuritiesSelected( state );
            
            return checkSecurity( securities, id, state );
        }

        case ACTIONS.STOCKANALYSIS_INDICATOR_ADD: {

            const { indicator } = action.data;

            const indicators = getIndicatorsSelected( state );

            if ( indicator && indicators.findIndex( a => a.key === indicator.key ) < 0 ) {
                indicators.push( indicator );
            }
            return {
                ...state,
                indicators: [ ...indicators ]
            };
        }
        case ACTIONS.STOCKANALYSIS_INDICATOR_DELETE: {

            const { key } = action.data;

            const indicators = getIndicatorsSelected( state ).filter( a => a.key !== key );

            return {
                ...state,
                indicators: [ ...indicators ]
            };
        }

        case ACTIONS.STOCKANALYSIS_UPDATE_ALL_STARTED:
            return {
                ...state,
                isLoading: true,
                error: undefined
            };
        case ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.error
            };
        case ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_SUCCEEDED: {

            const { securities:securitiesNew } = action.data;

            const securities = getSecuritiesSelected( state );

            for(let item of securitiesNew) {
                const prev = getSecuritySelectedById(state, item.securityId);
                if(prev) {
                    prev.history = item.history,
                    prev.description = item.description;
                }else{
                    console.log('NOT FOUND!');
                }
            }

            return {
                ...state,
                securities:[...securities],
                isLoading: false,
            };
        }

        default:
            return state;
    }
};


const addSecurityToList = ( security, history, description, state ) => {
    
    const securities = getSecuritiesSelected( state );

    const item = {
        securityId: security.securityId,
        selected: true
    };

    item.definition = security;
    item.history = history ? history : item.history;
    item.description = description ? description : item.description;
    
    const index = securities.findIndex( it => it.securityId === security.securityId );
    
    if ( index >= 0 ) {
        securities.splice( index, 1, item );
    }
    else {
        securities.unshift( item );
    }

    securities.map( a => a.securityId != security.securityId ? a.selected = false : '' );
    
    return {
        ...state,
        securities: [ ...securities ],
        isLoading: false
    };
};

const deleteSecurityFromList = ( securities, id, state ) => {
    if ( securities && securities.length > 1 ) {
        securities = securities.filter( it => it.securityId !== id );
        if ( securities.filter( it => it.selected ).length <= 0 ) {
            securities[ 0 ].selected = true;
        }
    }
    return {
        ...state,
        securities: [ ...securities ]
    };
};

const checkSecurity = ( securities, id, state ) => {
    if ( securities && securities.length ) {
        let item = securities.filter( a => a.securityId == id );
        if ( item && item.length ) {
            item[ 0 ].selected = true;
            securities.map( a => a.securityId != item[ 0 ].securityId ? a.selected = false : '' );
        }
    }
    return {
        ...state,
        securities: [ ...securities ]
    };
};



const getSecuritiesSelected = ( state ) => state.securities;
const getIndicatorsSelected = ( state ) => state.indicators;
const getIsLoading = ( state ) => state.isLoading;
const getStartDate = ( state ) => state.startDate;

const getSecuritySelectedById = createSelector(
    (state, securityId) => { return { suggestions: getSecuritiesSelected(state), securityId}; },
    ( obj ) => {
        const {suggestions, securityId} = obj;
        return suggestions.find(a => a.securityId === securityId);
    }
);

export const selectors = globalizeSelectors( {
    getSecuritiesSelected,
    getSecuritySelectedById,
    getIndicatorsSelected,
    getIsLoading,
    getStartDate
}, 'securitiesAnalysis' );


export { securitiesAnalysis };
