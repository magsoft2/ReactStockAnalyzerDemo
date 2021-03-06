import axios from 'axios';
import CONFIG from 'config';
import moment from 'moment';

import { getHashCode } from '../../utils';
import { LogService } from 'Services';
import { CONSTANTS } from '../../constants';


const baseUrl = 'https://iss.moex.com/';
const additionalArguments = 'iss.meta=off&iss.json=compact';

const MOEX_FIELD_NAMES = {
    BOARDID: 'BOARDID',
    TRADEDATE: 'TRADEDATE',
    SECID: 'SECID',
    OPEN: 'OPEN',
    HIGH: 'HIGH',
    LOW: 'LOW',
    CLOSE: 'CLOSE',
    VOLRUR: 'VOLRUR',
    VOLUME: 'VOLUME',
    LEGALCLOSEPRICE: 'LEGALCLOSEPRICE',
    MARKETPRICE2: 'MARKETPRICE2',
    MARKETPRICE3: 'MARKETPRICE3',
    NUMTRADES: 'NUMTRADES'
};



class MoexProviderClass {

    constructor () {
        this.requestsCache = {};

        this.instance = axios.create( {
            baseURL: baseUrl
        } );
    }

    getAllReferences = async () => {
        const res = await this.instance
            .get( 'iss/index.json?iss.only=securitycollections,securitygroups,securitytypes&' + additionalArguments )
            .then( ( data ) => {
                if ( data.response && ( data.response.status === 401 || data.response.status === 403 ) ) {
                    //LogService.log(JSON.stringify(data));
                }
                return Promise.resolve( data );
            } );

        const result = {
            securityTypes: [],
            securityGroups: []
        };

        if ( res.data && res.data.securitytypes && res.data.securitytypes.data &&
            res.data.securitygroups && res.data.securitygroups.data ) {

            result.securityTypes = res.data.securitytypes.data.map( securityTypesConvertor ).filter( item => item !== undefined );
            result.securityGroups = res.data.securitygroups.data.map( securityGroupsConvertor ).filter( item => item !== undefined );
        }

        return Promise.resolve( result );
    };

    getSecurityDescription = async ( securityId ) => {
        const res = await this.instance
            .get( `iss/securities/${ securityId }.json?${ additionalArguments }&iss.only=description` )
            .then( ( data ) => {
                if ( data.response && ( data.response.status === 401 || data.response.status === 403 ) ) {
                    //LogService.log(JSON.stringify(data));
                }
                return Promise.resolve( data );
            } );

        if ( res.data && res.data.description && res.data.description.data ) {
            const resConverted = res.data.description.data.map( securityDescriptionConvertor ).filter( item => item !== undefined );
            return Promise.resolve( resConverted );
        }

        return Promise.resolve( [] );
    };

    findSecurity = async ( securityName, seach_stock_limit ) => {
        const res = await this.instance
            .get( `iss/securities.json?q=${ securityName }&limit=${ seach_stock_limit }&is_trading=true&group_by=type&${ additionalArguments }` )
            .then( ( data ) => {
                if ( data.response && ( data.response.status === 401 || data.response.status === 403 ) ) {
                    //LogService.log(JSON.stringify(data));
                }
                return Promise.resolve( data );
            } );

        if ( res.data && res.data.securities && res.data.securities.data ) {
            let resConverted = res.data.securities.data.map( securityInfoConvertor ).filter( item => item !== undefined );
            if ( resConverted.length ) {
                resConverted = resConverted.filter( ( value, index, self ) => self.findIndex( el => el.id === value.id ) === index );
            }
            return Promise.resolve( resConverted );
        }

        return Promise.resolve( [] );
    };

    getSecurityHistory = async ( securityId, startDate, interval, engine, market ) => {
        const res = await this.instance
            .get( `iss/engines/${ engine }/markets/${ market }/securities/${ securityId }/candles.json?from=${ getFormattedDate( startDate ) }&interval=${ interval }&${ additionalArguments }` )
            .then( ( data ) => {
                if ( data.response && ( data.response.status === 401 || data.response.status === 403 ) ) {
                    //LogService.log(JSON.stringify(data));
                }
                return Promise.resolve( data );
            } );

        if ( res.data && res.data.candles && res.data.candles.data ) {
            const resConverted = res.data.candles.data.map( securityCandlesConvertor ).filter( item => item !== undefined );
            return Promise.resolve( resConverted );
        }

        return Promise.resolve( [] );
    };

    getSecurityPrice = async ( securityId, date, engine, market ) => {
        const limit = 5; //get correct board id
        const res = await this.instance
            .get( `iss/history/engines/${ engine }/markets/${ market }/securities/${ securityId }.json?till=${ getFormattedDate( date ) }&limit=${ limit }&sort_order_desc=desc&iss.only=history&${ additionalArguments }` )
            .then( ( data ) => {
                if ( data.response && ( data.response.status === 401 || data.response.status === 403 ) ) {
                    //LogService.log(JSON.stringify(data));
                }
                return Promise.resolve( data );
            } );

        if ( res.data && res.data.history && res.data.history.data ) {
            const resConverted = res.data.history.data.map( a => securityHistoryConvertor( a, res.data.history.columns ) )
                .filter( item => item !== undefined )
                .filter( item => item.close );
            if ( resConverted.length > 0 ) {
                return resConverted[ 0 ];
            } else {
                return Promise.resolve( resConverted );
            }
        }

        return Promise.resolve( {} );
    };

    async cacheRequest ( params, func ) {
        const key = getHashCode( JSON.stringify( params ) );

        if ( !this.requestsCache[ key ] ) {
            this.requestsCache[ key ] = func();
        }

        return Promise.resolve( this.requestsCache[ key ] );
    }

}

const securityInfoConvertor = ( item ) => {

    if ( !item || !item.length )
        return undefined;

    //["id", "secid", "shortname", "regnumber", "name", "isin", "is_traded", "emitent_id", "emitent_title", "emitent_inn", "emitent_okpo", 
    //"gosreg", "type", "group", "primary_boardid", "marketprice_boardid"],

    return {
        id: item[ 0 ],
        securityId: item[ 1 ],
        shortName: item[ 2 ],
        regNumber: item[ 3 ],
        name: item[ 4 ],
        isin: item[ 5 ],
        isTraded: item[ 6 ],
        emitentId: item[ 7 ],
        emitentTitle: item[ 8 ],
        emitentInn: item[ 9 ],
        emitentOkpo: item[ 10 ],
        gosReg: item[ 11 ],
        type: item[ 12 ],
        group: item[ 13 ],
        primaryBoardId: item[ 14 ],
        marketPriceBoardId: item[ 15 ],

        providerCode: CONSTANTS.DATA_PROVIDER_CODES.MOEX,
        currency: CONSTANTS.CURRENCY.RUB
    };
};

const securityDescriptionConvertor = ( item ) => {

    if ( !item || !item.length )
        return undefined;

    //"columns": ["name", "title", "value", "type", "sort_order", "is_hidden", "precision"], 

    return {
        name: item[ 0 ],
        title: item[ 1 ],
        value: item[ 2 ],
        type: item[ 3 ],
        sort_order: item[ 4 ],
        is_hidden: item[ 5 ],
        precision: item[ 6 ]
    };
};

const securityGroupsConvertor = ( item ) => {

    if ( !item || !item.length )
        return undefined;

    //"columns": ["id", "name", "title", "is_hidden"], 
    return {
        id: item[ 0 ],
        name: item[ 1 ],
        title: item[ 2 ],
        isHidden: item[ 3 ]
    };

};

const securityTypesConvertor = ( item ) => {

    if ( !item || !item.length )
        return undefined;

    //"columns": ["id", "trade_engine_id", "trade_engine_name", "trade_engine_title", "security_type_name", "security_type_title"], 
    return {
        id: item[ 0 ],
        engineId: item[ 1 ],
        engineName: item[ 2 ],
        engineTitle: item[ 3 ],
        typeName: item[ 4 ],
        typeTitle: item[ 5 ]
    };

};

const securityHistoryConvertor = ( item, columns ) => {

    if ( !item || !item.length )
        return undefined;

    //Note: format is different for different markets! TODO:check for other api results for it!
    //"columns": ["BOARDID", "TRADEDATE", "SHORTNAME", "SECID", "OPEN", "LOW", "HIGH", "CLOSE", "NUMTRADES", "VOLRUR", "WAPRICE"], 

    const map = columns.reduce( ( acc, curr, idx ) => { acc.set( curr, idx ); return acc; }, new Map() );

    return {
        boardId: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.BOARDID ),
        date: new Date( tryGetFieldValue( map, item, MOEX_FIELD_NAMES.TRADEDATE ) ),
        open: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.OPEN ),
        low: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.LOW ),
        high: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.HIGH ),
        close: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.CLOSE, MOEX_FIELD_NAMES.LEGALCLOSEPRICE, MOEX_FIELD_NAMES.MARKETPRICE2, MOEX_FIELD_NAMES.MARKETPRICE3 ),
        volume: tryGetFieldValue( map, item, MOEX_FIELD_NAMES.VOLUME, MOEX_FIELD_NAMES.VOLRUR )
    };
};

const tryGetFieldValue = ( map, item, ...fieldNames ) => {
    for(const name of fieldNames) {
        let idx = map.get( name );
        if ( idx && Array.isArray( item ) && idx < item.length && item[ idx ] ) {
            return item[ idx ];
        }
    }
    return undefined;
};

const securityCandlesConvertor = ( item ) => {

    if ( !item || !item.length )
        return undefined;

    //"columns": ["open", "close", "high", "low", "value", "volume", "begin", "end"], 

    return {
        open: item[ 0 ],
        close: item[ 1 ],
        high: item[ 2 ],
        low: item[ 3 ],
        value: item[ 4 ],
        volume: item[ 5 ],
        begin: new Date( item[ 6 ] ),
        end: new Date( item[ 7 ] ),
        date: new Date( item[ 6 ] )
    };
};

const getFormattedDate = ( date ) => {
    //date or string only
    const moexDateFormat = CONSTANTS.DateFormat;
    return ( date && typeof date === 'string' ) ? date : moment( date ).format( moexDateFormat );
};

export const MoexProvider = new MoexProviderClass();