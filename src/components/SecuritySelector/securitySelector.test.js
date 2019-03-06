import React from 'react';
import { call, put } from 'redux-saga/effects';
import assert from 'assert';

import { securitySearchFunc } from './sagas';
import { SecurityService, CacheService } from 'Services';
import {SecuritySelectorComponent } from './component';
import { ACTIONS } from './actions';


const mockSuggestions = {
    suggestions: {
		securitiesSuggestionsList: [{
				id: 76089,
				securityId: 'GBPRUB_TOM',
				shortName: 'GBPRUB_TOM',
				regNumber: null,
				name: 'GBP/RUB_TOM - GBP/РУБ',
				isin: null,
				isTraded: 1,
				type: 'currency',
				group: 'currency_selt',
				primaryBoardId: 'CETS',
				marketPriceBoardId: null,
				providerCode: 'MOEX',
				currency: 'RUB'
            }]
        },
    suggestionList: [],
    references: {
		securityTypes: [{
				id: 3,
				engineId: 1,
				engineName: 'stock',
				engineTitle: 'Фондовый рынок и рынок депозитов',
				typeName: 'common_share',
				typeTitle: 'Акция обыкновенная'
            }],
            securityGroups: [{
				id: 12,
				name: 'stock_index',
				title: 'Индексы',
				isHidden: 0
			}, {
				id: 4,
				name: 'stock_shares',
				title: 'Акции',
				isHidden: 0
			}]
        }
};


test( 'securitySelector component', () => {
    
    const store = mockStore({
        ...mockSuggestions
    });

    const wrapper = mount(
        <SecuritySelectorComponent
            store={store}
        />
    );

    const p = wrapper.find(".react-autosuggest");
    expect(p.length).toBe(1);

} );

test( 'securitySelector search OK', () => {

    CacheService.clearCache();

    const iterator = securitySearchFunc( { text: 'ind' } );
    //expect(iterator.next()).toEqual(call(CacheService.getOrAdd));

    iterator.next();
    iterator.next();

    // expects a call instruction
    assert.deepEqual(
        iterator.next().value,
        put( {data: {suggestionsList: undefined}, type: ACTIONS.SECURITY_SEARCH_SUCCEEDED} ),
        'securitySearchFunc should yield an Effect findSecurity'
    );

} );

test( 'securitySelector search FAIL', () => {
    const iterator = securitySearchFunc( { text: 'ind' } );

    iterator.next();
    iterator.next();
    
    // create a fake error
    const error = {};

    iterator.throw( error );

    // expects a dispatch instruction
    assert.deepEqual(
        iterator.next().value, // skip loader action
        put( { type: ACTIONS.SECURITY_SEARCH_FAILED, error } ),
        `securitySearchFunc should yield an Effect put({ type: '${ ACTIONS.SECURITY_SEARCH_FAILED }', error })`
    );

} );


test( 'two plus two is four', () => {
    expect( 2 + 2 ).toBe( 4 );
} );