import _ from 'lodash';


export class HistoryProcessor {


    static aggregateHistory = (positions) => {

        //TODO: aggregate portfolio history and make history calculations
        // Very non-optimal implementation!
        // Also works only for equal history dates in all stocks!
        const candles = [];
        for(const point of positions[0].securityItem.history.candles) {
            const candle = {
                ...point
            };
            candle.close = 0;
            for(const pos of positions) {
                const newPos = _.last(pos.securityItem.history.candles.filter(a => a.date.getTime() <= point.date.getTime()));
                if(newPos) {
                    candle.close += newPos.close*pos.shares;
                }
            }
            candles.push(candle);
        }
    
        return {
            securityId: 'Aggregated',
            candles
        };
    };


    static calculateHistoryProc = (history) => {
        
        const candles = history && history.candles ? history.candles : undefined;
        if(candles && candles.length) {
            const historyProc = [];
            const first = history.candles[0];
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

}