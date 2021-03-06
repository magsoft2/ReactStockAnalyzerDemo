
const pageStockAnalysisStateKey = 'stockAnalysisState';
const pagePortfolioStateKey = 'portfolioState';

class StoreServiceClass {

    constructor() {
    }

    storeStockAnalysisState = (data) => {
        this._store(pageStockAnalysisStateKey, data);
    };
    restoreStockAnalysisState = () => {
        let res = this._restore(pageStockAnalysisStateKey);
        if(!res) {
            res = {};
        }

        return res;
    };

    storePortfolioState = (data) => {
        this._store(pagePortfolioStateKey, data);
    };
    restorePortfolioState = () => {
        let res = this._restore(pagePortfolioStateKey);
        if(!res) {
            res = {};
        }

        return res;
    };


    _store = (key, data) => {
        
        localStorage.setItem(key, JSON.stringify(data));
    };

    _restore = (key) => {
        
        const item = localStorage.getItem(key);

        if(item){
            return JSON.parse(item, jsonDateParser);
        }

        return undefined;
    };

    _storeSession = (key, data) => {
        sessionStorage.setItem(key, JSON.stringify(data));
    };

    _restoreSession = (key) => {
        
        const item = sessionStorage.getItem(key);

        if(item){
            return JSON.parse(item, jsonDateParser);
        }

        return undefined;
    };
    
}

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

const jsonDateParser = (key, value) => {
   
    if (typeof value === 'string') {
        var a = reISO.exec(value);
        if (a)
            return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            var b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;

};

export const StoreService = new StoreServiceClass();