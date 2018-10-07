import moment from 'moment';
import { createSelector } from 'reselect';

import { globalizeSelectors, fromRoot } from 'utils';

import { LogService } from 'Services';
import {createDefaultPortfolioPositions} from 'domain/securityHelpers';

import { ACTIONS } from './actions';
import { CONSTANTS } from '../../constants';

const HISTORY_HORIZON_YEAR = 1;


const initialState = {
    positions: createDefaultPortfolioPositions(),
    startDate: moment().add( -1 * HISTORY_HORIZON_YEAR, 'years' ).format( CONSTANTS.dateFormat ),
    aggregatedData: {
        history: undefined,
        totalMav: 0,
        volatility: 0
    }
};


const portfolio = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.PORTFOLIO_STATE_RESTORE_SUCCEEDED:
            return {
                ...state,
                ...action.data
            };

        case ACTIONS.PORTFOLIO_SECURITY_ADD_STARTED:
            return {
                ...state,
                error: undefined
            };
        case ACTIONS.PORTFOLIO_SECURITY_ADD_FAILED:
            return {
                ...state,
                error: action.error
            };
        case ACTIONS.PORTFOLIO_SECURITY_ADD_SUCCEEDED: {

            const { security } = action.data;

            return addSecurityToPortfolio( security, state );
        }
        case ACTIONS.PORTFOLIO_SECURITY_DELETE: {

            let { idx } = action.data;
            const positions = getPositions( state );

            return deleteSecurityFromPortfolio( positions, idx, state );
        }
        case ACTIONS.PORTFOLIO_POSITION_EDIT: {

            let { idx, newPosition } = action.data;
            const positions = getPositions( state );

            if(positions && idx < positions.length && positions[idx].shares != newPosition) {

                positions[idx].shares = newPosition;

                return {
                    ...state,
                    positions: [ ...positions ]
                };
            }
            return state;
        }
        case ACTIONS.PORTFOLIO_CALCULATE_ALL: {

            return processPortfolio( state );
        }

        case ACTIONS.PORTFOLIO_UPDATE_ALL_STARTED:
            return {
                ...state,
                error: undefined
            };
        case ACTIONS.PORTFOLIO_UPDATE_ALL_ADD_FAILED:
            return {
                ...state,
                error: action.error
            };
        case ACTIONS.PORTFOLIO_UPDATE_ALL_ADD_SUCCEEDED: {

            const { securities } = action.data;

            const positions = getPositions( state );

            for ( const item of securities ) {
                for ( const pos of positions ) {
                    if ( item.securityId === pos.securityId ) {//TODO: optimize it!
                        pos.securityItem = item;
                    }
                }
            }

            return {
                ...state,
                positions: [ ...positions ]
            };
        }

        default:
            return state;
    }
};


const addSecurityToPortfolio = ( security, state ) => {

    const positions = getPositions( state );

    security.selected = true;

    positions.push( {
        securityId: security.securityId,
        securityItem: security,
        shares: 1,
        currency: CONSTANTS.CURRENCY.RUB,
        marketValue: security.price.close*1,
        timeStamp: new Date(),
        calculatedData: {
            volatility: undefined
        }
    } );

    return {
        ...state,
        positions: [ ...positions ]
    };
};

const deleteSecurityFromPortfolio = ( positions, idx, state ) => {
    if ( positions && idx < positions.length) {
        positions.splice(idx, 1);
    }
    return {
        ...state,
        positions: [ ...positions ]
    };
};

const processPortfolio = ( state ) => {

    const positions = getPositions( state );

    for(const pos of positions) {
        pos.marketValue = pos.securityItem.price.close*pos.shares;
    }

    //TODO: implement process portfolio logic

    return {
        ...state,
        positions: [ ...positions ]
    };
};


const getPositions = ( state ) => state.positions;
const getStartDate = ( state ) => state.startDate;

const getSecuritySelectedById = createSelector(
    ( state, securityId ) => { return { suggestions: getPositions( state ), securityId }; },
    ( obj ) => {
        const { suggestions, securityId } = obj;
        return suggestions.find( a => a.securityId === securityId );
    }
);

export const selectors = globalizeSelectors( {
    getPositions,
    getSecuritySelectedById,
    getStartDate
}, 'portfolio' );


export { portfolio };
