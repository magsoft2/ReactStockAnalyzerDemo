import moment from 'moment';

import { LogService } from 'Services';
import {DefaultCollections} from 'domain/defaultCollections';
import {HistoryProcessor} from 'domain/historyProcessor';
import {PortfolioProcessor} from 'domain/portfolioProcessor';

import { ACTIONS } from './actions';
import {ACTIONS as GLOBAL_ACTIONS} from 'root/actions';
import { CONSTANTS } from '../../constants';

import {selectors} from './selectors';

const HISTORY_HORIZON_YEAR = 1;


const initialState = {
    positions: DefaultCollections.createDefaultPortfolioPositions(),
    startDate: moment().add( -1 * HISTORY_HORIZON_YEAR, 'years' ).format( CONSTANTS.dateFormat ),
    horizon: 12, //TODO: implement horizon GUI
    calculatedData: {
        history: undefined,
        historyProc: undefined,
        historyReferenceBased: undefined,
        marketValue: 0,
        volatility: 0,
        performance: 0,
        positionProc: 100
    },
    referenceData: {
        referenceSecurityItem: undefined,
        referenceHistoryProc: undefined
    },
    factors: []
};


const portfolio = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ACTIONS.PORTFOLIO_STATE_RESTORE_SUCCEEDED:
            return processPortfolio( {
                ...state,
                ...action.data
            });

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

            return processPortfolio( addPortfolioPosition( state, security ));
        }
        case ACTIONS.PORTFOLIO_SECURITY_DELETE: {

            const { idx } = action.data;            

            return processPortfolio(deletePortfolioPosition( state, idx ));
        }
        case ACTIONS.PORTFOLIO_POSITION_EDIT: {

            let { idx, newPosition } = action.data;

            return processPortfolio(editPortfolioPosition( state, idx, newPosition ));      
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

            return processPortfolio(updateAllSecurities( state, securities ));     

        }

        case ACTIONS.PORTFOLIO_CHANGE_REFERENCE: {
            const { referenceItem } = action.data;

            const referenceData = selectors.getReferenceData( state );

            referenceData.referenceSecurityItem = referenceItem;
            referenceData.referenceHistoryProc = undefined;

            const newState = {
                ...state,
                referenceData
            };
            return processPortfolio(newState);
        }

        case GLOBAL_ACTIONS.INITIALIZE_COMPLETED:
            
            return processPortfolio({
                ...state,
                factors: action.data.references.indexes
            });


        default:
            return state;
    }
};


const addPortfolioPosition = ( state, security, shares = 1 ) => {

    const positions = selectors.getPositions( state );

    security.selected = true;

    const position = {
        securityId: security.securityId,
        securityItem: security,
        shares,
        currency: CONSTANTS.CURRENCY.RUB,
        timeStamp: new Date()
    };

    positions.push(position);

    return {
        ...state,
        positions
    };
};
const deletePortfolioPosition = ( state, idx ) => {

    const positions = selectors.getPositions( state );

    if ( positions && idx < positions.length) {
        positions.splice(idx, 1);
    }
    return {
        ...state,
        positions
    };
};
const editPortfolioPosition = ( state, idx, newShares ) => {
    const positions = selectors.getPositions( state );

    if(positions && idx < positions.length && positions[idx].shares != newShares) {
        positions[idx].shares = newShares;

        return {
            ...state,
            positions
        };
    }
    return state;
};
const updateAllSecurities = ( state, securities ) => {

    const positions = selectors.getPositions( state );

    for ( const item of securities ) {
        for ( const pos of positions ) {
            if ( item.securityId === pos.securityId ) {//TODO: optimize it!
                pos.securityItem = item;
            }
        }
    }

    return {
        ...state,
        positions
    };
};

const processPortfolio = ( state ) => {

    const {positions, calculatedData, referenceData} = PortfolioProcessor.processPortfolio(
        selectors.getPositions( state ), 
        selectors.getPortfolioCalculatedData( state ), 
        selectors.getReferenceData( state ),
        selectors.getFactors( state )
    );
   

    return {
        ...state,
        positions: [ ...positions ],
        calculatedData: {...calculatedData},
        referenceData
    };
};

export { portfolio };
