
import {MoexProvider} from '../MoexProvider';

const interval = 24;
const seach_stock_limit = 100;



class SecurityServiceClass {

    constructor() {
    }


    getAllReferences = () => {
    	return MoexProvider.getAllReferences();
    };

    findSecurity = (securityName) => {
    	return MoexProvider.findSecurity(securityName, seach_stock_limit);
    };

    getSecurityDescription = (securityId) => {
    	return MoexProvider.getSecurityDescription(securityId);
    };

    getSecurityHistory = async(securityId, group, startDate) => {

    	const [engine, market] = group.split('_');
        
        const resHist = await MoexProvider.getSecurityHistory(securityId, startDate, interval, engine, market);
        
        return {
            securityId: securityId,
            candles: resHist
        };
    };

    getSecurityPrice = async(securityId, group, date = new Date()) => {

    	const [engine, market] = group.split('_');
        
        return await MoexProvider.getSecurityPrice(securityId, date, engine, market);
    };

}

export const SecurityService = new SecurityServiceClass();