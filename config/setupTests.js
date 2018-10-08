import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, render, mount, configure } from 'enzyme';

configure({ 'adapter': new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

//mock store for redux
import configureMockStore from "redux-mock-store";
global.mockStore = function (store) { const mock = configureMockStore(); return mock(store); };


