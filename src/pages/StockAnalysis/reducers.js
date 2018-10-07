import moment from 'moment';
import {createSelector } from 'reselect';

import CONSTANTS from 'constants';
import { globalizeSelectors, fromRoot } from 'utils';
import {createDefaultSecurityList} from 'domain/securityHelpers';
import { LogService } from 'Services';

import { ACTIONS } from './actions';

const HISTORY_HORIZON_YEAR = 1;




const initialState = {
    securities: createDefaultSecurityList(),
    indicators: [],

    startDate: moment().add( -1*HISTORY_HORIZON_YEAR, 'years' ).format( CONSTANTS.dateFormat ),
};


const securitiesAnalysis = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.STOCKANALYSIS_STATE_RESTORE_SUCCEEDED: {
            const { securities = state.securities } = action.data;

            return {
                ...state,
                ...action.data,
                securities: [...securities]
            };
        }

        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_STARTED:
            return {
                ...state,
                error: undefined
            };
        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_FAILED:
            return {
                ...state,
                error: action.error
            };
        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_SUCCEEDED: {

            const { security } = action.data;

            return addSecurityToList( security, state );
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
                error: undefined
            };
        case ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_FAILED:
            return {
                ...state,
                error: action.error
            };
        case ACTIONS.STOCKANALYSIS_UPDATE_ALL_ADD_SUCCEEDED: {

            const { securities:securitiesNew } = action.data;

            const securities = getSecuritiesSelected( state );

            for(let item of securitiesNew) {
                const prev = getSecuritySelectedById(state, item.securityId);
                if(prev) {
                    prev.history = item.history;
                    prev.description = item.description;
                    prev.price = item.price;
                }else{
                    LogService.log('NOT FOUND: ' + item.securityId);
                }
            }

            return {
                ...state,
                securities:[...securities]
            };
        }

        default:
            return state;
    }
};


const addSecurityToList = ( security, state ) => {
    
    const securities = getSecuritiesSelected( state );

    security.selected = true;

    const index = securities.findIndex( it => it.securityId === security.securityId );
    
    if ( index >= 0 ) {
        securities.splice( index, 1, security );
    }
    else {
        securities.unshift( security );
    }

    securities.map( a => a.securityId != security.securityId ? a.selected = false : '' );
    
    return {
        ...state,
        securities: [ ...securities ]
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
    getStartDate
}, 'securitiesAnalysis' );


export { securitiesAnalysis };
