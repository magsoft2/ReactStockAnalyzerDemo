import React from 'react';
import { call, put } from 'redux-saga/effects';
import assert from 'assert';

import {LoaderComponent } from './Loader/component';


const mockNotifications = {
    showLoader: false,
    message: '',
    progressTick: 0,
    notifications: []
};


test( 'GlobalNotifaction, test Loader hide', () => {
    
    const store = mockStore({
        notifications: mockNotifications
    });

    const wrapper = mount(
        <LoaderComponent
            store={store}
        />
    );

    expect(wrapper.exists('.loader')).toEqual(false);

} );

test( 'GlobalNotifaction, test Loader show', () => {
    
    const store = mockStore({
        notifications: {
            ...mockNotifications,
            showLoader: true
        }
    });

    const wrapper = mount(
        <LoaderComponent
            store={store}
        />
    );

    const p = wrapper.find('.loader');
    expect(p.length).toBe(1);

} );

