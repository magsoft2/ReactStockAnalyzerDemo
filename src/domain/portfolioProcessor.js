
import * as statProcessor from 'simple-statistics';
//import ubique from 'ubique';
import { HistoryProcessor } from 'domain/historyProcessor';

import {selectors} from 'pages/Portfolio';


const getPositionPrice = (position) => position && position.securityItem && position.securityItem.price ? position.securityItem.price.close : NaN;


export class PortfolioProcessor {

    static calculateData = (calculatedData, candles, portfolioData) => {
        if(candles && candles.length > 0) {
            const first = candles[0].close;
            const last = candles[candles.length - 1].close;
            if(first !== 0) {
                calculatedData.performance = 100*(last - first)/first;
                const data = candles.map(a=>a.close);
                const mean = statProcessor.mean(data);
                calculatedData.volatility = 100*statProcessor.standardDeviation(candles.map(a=>a.close))/mean;
                //calculatedData.volatility = ubique.annrisk(data);
                //ubique.histvar(W)
            }
        }
    };

    static processPortfolio = (positions, calculatedData, referenceData, factors) => {

        //TODO: implement process portfolio logic
        // position calculations could depend on portfolio level
        // refactor this simple implementation

        calculatedData.history = HistoryProcessor.aggregateHistory(positions);
        calculatedData.history.securityId = 'Portfolio';

        calculatedData.historyProc = HistoryProcessor.calculateHistoryProc(calculatedData.history);
        
        if(referenceData && referenceData.referenceSecurityItem) {
            referenceData.referenceHistoryProc = HistoryProcessor.calculateHistoryProc(referenceData.referenceSecurityItem.history);
        }else{
            referenceData.referenceHistoryProc = undefined;
        }

        //2. process every position
        for(const position of positions) {
            PortfolioProcessor.processPortfolioPosition(position, calculatedData);
        }

        //3. calculate portfolio data
        calculatedData.marketValue = 0;
        for(const position of positions) {
            calculatedData.marketValue += selectors.getCalculatedData(position, 'marketValue');
        }

        //calc position data dependent on portfolio level
        for(const position of positions) {
            position.calculatedData.positionProc = 100*selectors.getCalculatedData(position, 'marketValue')/calculatedData.marketValue;
        }

        const candles = calculatedData.history && calculatedData.history.candles  ? calculatedData.history.candles : [];
    
        PortfolioProcessor.calculateData(calculatedData, candles, calculatedData);

        //factors
        const portArray = candles.map(a=>a.close);
        calculatedData.factors = [];
        for(const index of factors) {
            if(index.history && index.history.candles.length === portArray.length) {
                const data = index.history.candles.map(a=>a.close);
                calculatedData.factors.push({
                    id:index.securityId,
                    correlation: statProcessor.sampleCorrelation(data, portArray)
                }
                );
            }
        }

        return {positions, calculatedData, referenceData};

    };


    static processPortfolioPosition = (position, portfolioData) => {
    
        position.calculatedData = {
            volatility: 0,
            performance: 0,
            positionProc: 0,
            marketValue: getPositionPrice(position)*position.shares
        };
    
        const candles = position.securityItem.history && position.securityItem.history.candles  ? position.securityItem.history.candles : undefined;
        
        PortfolioProcessor.calculateData(position.calculatedData, candles, portfolioData);
    
    };

}


