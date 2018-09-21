import axios from "axios";
import CONFIG from "config";
import {getHashCode} from '../../utils';


const baseUrl = 'https://iss.moex.com/';


class MoexProviderClass {

    constructor() {
        this.requestsCache = {};
		
		this.instance = axios.create({
		  baseURL:baseUrl
		});
    };

    getAllReferences = async () => {
        const res = await this.instance
			.get(`iss/index.json`)
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
            });
            
        if (res.data && res.data.securities && res.data.securities.data) {
            let resConverted = res.data.securities.data.map(securityInfoConvertor).filter(item => item !== undefined);
            if (resConverted.length) {
                resConverted = resConverted.filter((value, index, self) => self.findIndex(el => el.id === value.id) === index);
            }
            return Promise.resolve(resConverted);
        }

        return Promise.resolve([]);
    };

    getSecurityDescription = async (securityId) => {
        const res = await this.instance
			.get(`iss/securities/${securityId}.json`)
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
            });
            
        if (res.data && res.data.description && res.data.description.data) {
            const resConverted = res.data.description.data.map(securityDescriptionConvertor).filter(item => item !== undefined);
            return Promise.resolve(resConverted);
        }

        return Promise.resolve([]);
    };

    findSecurity = async (securityName, seach_stock_limit) => {
        const res = await this.instance
			.get(`iss/securities.json?q=${securityName}&limit=${seach_stock_limit}&is_trading=true&group_by=type`) //&engine=${engine}&market=${market}
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
            });
            
        if (res.data && res.data.securities && res.data.securities.data) {
            let resConverted = res.data.securities.data.map(securityInfoConvertor).filter(item => item !== undefined);
            if (resConverted.length) {
                resConverted = resConverted.filter((value, index, self) => self.findIndex(el => el.id === value.id) === index);
            }
            return Promise.resolve(resConverted);
        }

        return Promise.resolve([]);
    };

    getSecurityHistory = async(securityId, startDate, interval, engine, market) => {
        const res =  await this.instance
			.get(`iss/engines/${engine}/markets/${market}/securities/${securityId}/candles.json?from=${startDate}&interval=${interval}`)
			.then((data) => {
				if(data.response && (data.response.status === 401 || data.response.status === 403))
				{
					//console.log(JSON.stringify(data));
				}
				return Promise.resolve(data);
            }); 
            
        if (res.data && res.data.candles && res.data.candles.data) {
            const resConverted = res.data.candles.data.map(securityHistoryConvertor).filter(item => item !== undefined);
            return Promise.resolve(resConverted);
        }
    
        return Promise.resolve([]);
    };

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
    };

}

const securityInfoConvertor = (item) => {
    
    if(!item || !item.length )
        return undefined;
    
    //["id", "secid", "shortname", "regnumber", "name", "isin", "is_traded", "emitent_id", "emitent_title", "emitent_inn", "emitent_okpo", 
    //"gosreg", "type", "group", "primary_boardid", "marketprice_boardid"],

    return {
        id: item[0],
        securityId: item[1],
        shortName: item[2],
        regNumber: item[3],
        name: item[4],
        isin: item[5],
        isTraded: item[6],
        emitentId: item[7],
        emitentTitle: item[8],
        emitentInn: item[9],
        emitentOkpo: item[10],
        gosReg: item[11],
        type: item[12],
        group: item[13],
        primaryBoardId: item[14],
        marketPriceBoardId: item[15]
    };
};

const securityDescriptionConvertor = (item) => {
    
    if(!item || !item.length )
        return undefined;
    
    //"columns": ["name", "title", "value", "type", "sort_order", "is_hidden", "precision"], 

    return {
        name: item[0],
        title: item[1],
        value: item[2],
        type: item[3],
        sort_order: item[4],
        is_hidden: item[5],
        precision: item[6]
    };
};

const referenceConvertor = (list) => {
    
    if(!list)
        return undefined;

        /*
    list.durations, //!
    list.securitytypes, //!
    list.securitygroups, //!

    
    ///???list.boards,
    list.engines,
    list.markets,
    */
};

const securityHistoryConvertor = (item) => {
    
    if(!item || !item.length )
        return undefined;
    
    //"columns": ["open", "close", "high", "low", "value", "volume", "begin", "end"], 

    return {
        open: item[0],
        close: item[1],
        high: item[2],
        low: item[3],
        value: item[4],
        volume: item[5],
        begin: new Date(item[6]),
        end: new Date(item[7]),
        date:  new Date(item[6])
    };
};

export const MoexProvider = new MoexProviderClass();