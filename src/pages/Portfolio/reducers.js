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
        referenceHistory: undefined,
        referenceHistoryProc: undefined
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

        default:
            return state;
    }
};


const addPortfolioPosition = ( state, security, shares = 1 ) => {

    const positions = getPositions( state );

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

    const positions = getPositions( state );

    if ( positions && idx < positions.length) {
        positions.splice(idx, 1);
    }
    return {
        ...state,
        positions
    };
};
const editPortfolioPosition = ( state, idx, newShares ) => {
    const positions = getPositions( state );

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
        positions
    };
};

const processPortfolioPosition = (position, portfolioData) => {
    
    position.calculatedData = {
        volatility: 0,
        performance: 0,
        positionProc: 0,
        marketValue: getPositionPrice(position)*position.shares
    };

    const candles = position.securityItem.history && position.securityItem.history.candles  ? position.securityItem.history.candles : undefined;
    
    calculateData(position.calculatedData, candles, portfolioData);

};
const calculateData = (calculatedData, candles, portfolioData) => {
    if(candles && candles.length > 0) {
        const first = candles[0].close;
        const last = candles[candles.length - 1].close;
        if(first !== 0) {
            calculatedData.performance = 100*(last - first)/first;
         
            //for test!
            calculatedData.volatility = Math.abs(last - first);
        }
    }
};
const processPortfolio = ( state ) => {

    const positions = getPositions( state );
    const calculatedData = getPortfolioCalculatedData( state );
    const referenceData = getReferenceData( state );

    //TODO: implement process portfolio logic
    // position calculations could depend on portfolio level
    // refactor this simple implementation

    //1. TODO: aggregate portfolio history and make history calculations
    calculatedData.history = aggregateHistory(positions);

    calculatedData.historyProc = getProcHistory(calculatedData.history);
    referenceData.history = {...positions[1].securityItem.history};
    referenceData.history.securityId = 'Reference';
    if(referenceData && referenceData.referenceHistory) {
        referenceData.referenceHistoryProc = getProcHistory(referenceData.referenceHistory);
    }

   

    //2. calculate every position
    for(const position of positions) {
        processPortfolioPosition(position, calculatedData);
    }

    //3. calculate portfolio data
    calculatedData.marketValue = 0;
    for(const position of positions) {
        calculatedData.marketValue += getCalculatedData(position, 'marketValue');
    }
    for(const position of positions) {
        position.calculatedData.positionProc = Number(100*getCalculatedData(position, 'marketValue')/calculatedData.marketValue).toFixed(2);
    }
    const candles = calculatedData.history && calculatedData.history.candles  ? calculatedData.history.candles : undefined;
    
    calculateData(calculatedData, candles, calculatedData);
   

    return {
        ...state,
        positions: [ ...positions ],
        calculatedData,
        referenceData
    };
};

const getProcHistory = (history) => {
    const candles = history && history.candles ? history.candles : undefined;
    if(candles && candles.length) {
        const historyProc = [];
        const first = history.candles
        for(const pos of history.candles){
            const point = {...pos};
            point.close = 100*(point.close - first.close)/first.close;
            historyProc.push(point);
        }
        return {
            securityId: history.securityId,
            candles: historyProc
        };
    }
    return undefined;
};
const aggregateHistory = (positions) => {

    //return {...positions[0].securityItem.history, securityId: 'Portfolio'};

    // Very non-optimal implementation!
    // Also works only for equal history dates in all stocks!
    const candles = [];
    for(const point of positions[0].securityItem.history.candles) {
        const candle = {
            ...point
        };
        candle.close = 0;
        for(const pos of positions) {
            const p = pos.securityItem.history.candles.filter(a => a.date.getTime() === point.date.getTime());
            if(p && p.length) {
                candle.close += p[0].close*pos.shares;
            }
        }
        candles.push(candle);
    }

    return {
        securityId: 'Portfolio',
        candles
    };
};


const getPositions = ( state ) => state.positions;
const getStartDate = ( state ) => state.startDate;
const getPositionPrice = (position) => position && position.securityItem && position.securityItem.price ? position.securityItem.price.close : NaN;
const getPortfolioCalculatedData = (state, fieldName = undefined) => {
    return getCalculatedData(state, fieldName);
};
const getReferenceData = (state) => state.referenceData;
const getCalculatedData = (position, fieldName = undefined) => {
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

export const selectors = globalizeSelectors( {
    getPositions,
    getSecuritySelectedById,
    getStartDate,
    getPortfolioCalculatedData,
    getReferenceData
}, 'portfolio' );


export { portfolio };
