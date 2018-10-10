
import { CONSTANTS } from '../constants';


export const createDefStockItem = (id, group, selected = false) => {
    const definition = {
        securityId: id,
        group: group
    };

    return {
        securityId: definition.securityId,
        selected: selected,
        definition,
        history: undefined,
        description: undefined,
        price: undefined
    };
};

export const createDefaultSecurityList = () => {
    return [
        createDefStockItem('USD000UTSTOM', 'currency_selt', true),
        createDefStockItem('EUR_RUB__TOM', 'currency_selt'),
        createDefStockItem('GAZP', 'stock_shares'),
        createDefStockItem('YNDX', 'stock_shares'),
        createDefStockItem('LKOH', 'stock_shares'),
        createDefStockItem('RTSI', 'stock_index'),
        createDefStockItem('MGNT', 'stock_shares'),
        createDefStockItem('SBERP', 'stock_shares'),
        createDefStockItem('RTSSTD', 'stock_index'),
        createDefStockItem('MICEX10INDEX', 'stock_index'),
        createDefStockItem('MICEXO&G', 'stock_index'),
        createDefStockItem('AFH9', 'futures_forts'),
    ];
};

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

export const createDefaultPortfolioPositions = () => {

    return [
        createDefStockItem('USD000UTSTOM', 'currency_selt', true),
        createDefStockItem('GAZP', 'stock_shares'),
        createDefStockItem('YNDX', 'stock_shares'),
        createDefStockItem('LKOH', 'stock_shares'),
        createDefStockItem('MGNT', 'stock_shares'),
        createDefStockItem('SBERP', 'stock_shares'),
        createDefStockItem('AFH9', 'futures_forts'),
    ].map(item => createPortfolioPosition(item));
};