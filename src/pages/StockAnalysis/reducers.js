import moment from 'moment';

import CONSTANTS from 'constants';


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
        case ACTIONS.STOCKANALYSIS_SECURITY_ADD_SUCCEEDED:
            return {
                ...state,
                securities: [ ...action.data.securities ],
                isLoading: false
            };
        case ACTIONS.STOCKANALYSIS_SECURITY_DELETE: {

            let { id, securities } = action.data;

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
        }
        case ACTIONS.STOCKANALYSIS_SECURITY_CHECK: {

            const { id, securities } = action.data;

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
        }
        default:
            return state;
    }
};

export { securitiesAnalysis };