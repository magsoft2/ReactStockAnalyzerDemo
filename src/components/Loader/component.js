import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.styl';

import { getLoaderShownState } from './reducers';


@connect( ( state ) => {
    return {
        showLoader: getLoaderShownState(state)
    };
})
class LoaderComponent extends PureComponent {
    static propTypes = {
        showLoader: PropTypes.bool
    }

    render () {
        const { showLoader = false } = this.props;

        if(!showLoader)
            return null;
        return (            
            <div className='loader'>
            </div>
        );
    }
}

export { LoaderComponent };