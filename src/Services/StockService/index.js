import axios from "axios";
import CONFIG from "config";
import {getHashCode} from '../../utils';

import {MoexProvider} from '../MoexProvider';

const interval = 60;
const seach_stock_limit = 100;



class StockServiceClass {

    constructor() {
    }


    getAllReferences = () => {
        return MoexProvider.getAllReferences();
    };

    findStock = (stockName) => {
        return MoexProvider.findStock(stockName, seach_stock_limit);
    };

    getStockDescription = (securityId) => {
        return MoexProvider.getStockDescription(securityId);
    };

    getStockHistory = (stockId, group, startDate) => {

        const [engine, market] = group.split('_');
        
        return MoexProvider.getStockHistory(stockId, startDate, interval, engine, market);
    };

};

export const StockService = new StockServiceClass();