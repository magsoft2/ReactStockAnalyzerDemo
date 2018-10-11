import { CONSTANTS } from '../constants';
import { Security } from './securityHelpers';


export class DefaultCollections {

    static createDefaultSecurityList = () => {
        return [
            Security.createStockItem('USD000UTSTOM', 'currency_selt', true),
            Security.createStockItem('EUR_RUB__TOM', 'currency_selt'),
            Security.createStockItem('GAZP', 'stock_shares'),
            Security.createStockItem('YNDX', 'stock_shares'),
            Security.createStockItem('LKOH', 'stock_shares'),
            Security.createStockItem('RTSI', 'stock_index'),
            Security.createStockItem('MGNT', 'stock_shares'),
            Security.createStockItem('SBERP', 'stock_shares'),
            Security.createStockItem('RTSSTD', 'stock_index'),
            Security.createStockItem('MICEX10INDEX', 'stock_index'),
            Security.createStockItem('MICEXO&G', 'stock_index'),
            Security.createStockItem('AFH9', 'futures_forts'),
        ];
    };    
    
    static createDefaultPortfolioPositions = () => {
    
        return [
            Security.createStockItem('USD000UTSTOM', 'currency_selt', true),
            Security.createStockItem('GAZP', 'stock_shares'),
            Security.createStockItem('YNDX', 'stock_shares'),
            Security.createStockItem('LKOH', 'stock_shares'),
            Security.createStockItem('MGNT', 'stock_shares'),
            Security.createStockItem('SBERP', 'stock_shares'),
            Security.createStockItem('AFH9', 'futures_forts'),
        ].map(item => createPortfolioPosition(item));
    };
    
    static createDefaultIndexList = () => {
    
        return [
            Security.createStockItem('IMOEX', 'stock_index'),
            Security.createStockItem('MICEX10INDEX', 'stock_index'),
            Security.createStockItem('RTSI', 'stock_index'),
            Security.createStockItem('RTSSTD', 'stock_index'),
            Security.createStockItem('MICEXFNL', 'stock_index'),
            Security.createStockItem('MICEXO&G', 'stock_index'),
            Security.createStockItem('MICEXM&M', 'stock_index'),
            Security.createStockItem('MICEXCGS', 'stock_index'),
            Security.createStockItem('MICEXPWR', 'stock_index'),
            Security.createStockItem('MICEXTLC', 'stock_index'),
            Security.createStockItem('RUBMI', 'stock_index'),
            Security.createStockItem('MICEXTRN', 'stock_index'),
            Security.createStockItem('MICEXCHM', 'stock_index'),
            Security.createStockItem('MICEXINNOV', 'stock_index'),
            Security.createStockItem('RTSSIB', 'stock_index'),
            Security.createStockItem('MICEXSC', 'stock_index'),
            Security.createStockItem('MICEXMNF', 'stock_index'),
            Security.createStockItem('OPSI', 'stock_index')
        ];
    };
         
}

const createPortfolioPosition = (security, shares = 1, currency = CONSTANTS.CURRENCY.RUB) => {
    return {
        securityId: security.securityId,
        securityItem: security,
        shares,
        currency,
        marketValue: undefined,
        timeStamp: new Date()
    };
};  