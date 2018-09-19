
import {MoexProvider} from '../MoexProvider';

const interval = 60;
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

    getSecurityHistory = (securityId, group, startDate) => {

        const [engine, market] = group.split('_');
        
        return MoexProvider.getSecurityHistory(securityId, startDate, interval, engine, market);
    };

};

export const SecurityService = new SecurityServiceClass();