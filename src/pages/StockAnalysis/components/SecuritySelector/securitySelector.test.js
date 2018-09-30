import React from 'react';
import renderer from 'react-test-renderer';
import { call, put } from 'redux-saga/effects';
import assert from 'assert';

import { securitySearchFunc } from './sagas';
import { SecurityService } from 'Services';
import { ACTIONS } from './actions';


test( 'test secirity search OK', () => {
    const iterator = securitySearchFunc( { text: 'ind' } );

    iterator.next();
    iterator.next();

    // expects a call instruction
    assert.deepEqual(
        iterator.next().value,
        call( SecurityService.findSecurity, 'ind' ),
        'securitySearchFunc should yield an Effect findSecurity'
    );

} );

test( 'test secirity search FAIL', () => {
    const iterator = securitySearchFunc( { text: 'ind' } );

    iterator.next();
    
    // create a fake error
    const error = {};

    // expects a dispatch instruction
    assert.deepEqual(
        iterator.throw( error ).value,
        put( { type: ACTIONS.SECURITY_SEARCH_FAILED, error } ),
        `securitySearchFunc should yield an Effect put({ type: '${ ACTIONS.SECURITY_SEARCH_FAILED }', error })`
    );

} );


test( 'two plus two is four', () => {
    expect( 2 + 2 ).toBe( 4 );
} );