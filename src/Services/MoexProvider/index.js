import axios from "axios";
import CONFIG from "config";
import {getHashCode} from '../../utils';

const baseUrl = 'https://iss.moex.com/';
const interval = 60;
const engine = 'stock';
const market='shares';
const seach_stock_limit = 20;

class MoexProviderClass {

    constructor() {
        this.requestsCache = {};
		
		this.instance = axios.create({
		  baseURL:baseUrl
		});
    }

    findStock(stockName) {
        return this.instance
			.get(`iss/securities.json?q=${stockName}&engine=${engine}&market=${market}&limit=${seach_stock_limit}`)
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
			})  
    }

    getStockHistory(stockName, startDate='2018-07-01') {
        return this.instance
			.get(`iss/engines/${engine}/markets/${market}/securities/${stockName}/candles.json?from=${startDate}&interval=${interval}`)
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
			})  
    }

    // async getGeoObjectIdsByName(params) {
        // //return tuiApiInstance({baseURL:CONFIG.baseAuthUrl}).post(`api/content/geoobjectids`, {...params });

        // return await this.cacheRequest(params, () => tuiApiInstance({baseURL:CONFIG.baseAuthUrl}).post(`api/content/geoobjectids`, {...params }));
    // }
    

    async cacheRequest(params, func){
        const key = getHashCode(JSON.stringify(params));

        if(!this.requestsCache[key]){
            this.requestsCache[key] = func();
        }
        
        return Promise.resolve(this.requestsCache[key]);
    }

}

export const MoexProvider = new MoexProviderClass();