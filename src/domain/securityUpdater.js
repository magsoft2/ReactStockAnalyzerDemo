
import { put, takeEvery, all, call, select } from 'redux-saga/effects';

import { showMessage } from 'components/GlobalNotification';

import { LogService, SecurityService } from 'Services';



export function* updateSecurityData ( securityItem, startDate ) {
    const [ description, history, price ] = yield all(
        [ call( SecurityService.getSecurityDescription, securityItem.securityId ),
        call( SecurityService.getSecurityHistory, securityItem.securityId, securityItem.definition.group, startDate ),
        call( SecurityService.getSecurityPrice, securityItem.securityId, securityItem.definition.group, new Date() ) ]
    );

    return {
        ...securityItem,
        history: history ? history : securityItem.history,
        description: description ? description : securityItem.description,
        price
    };
}

export function* updateSecuritiesData ( securities, startDate ) {
    const res = [];

    if ( securities && securities.length ) {
        let counter = 1;
        for ( const item of securities ) {

            yield put( showMessage( `Updating ${ item.definition.name ? item.definition.name : item.securityId }...`,
                Math.round( counter * 100 / securities.length ) ) );

            const updated = yield* updateSecurityData( item, startDate );
            res.push( updated );

            counter++;
        }
    }

    return res;
}