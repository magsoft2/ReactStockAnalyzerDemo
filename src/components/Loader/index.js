import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './index.styl';


export class LoaderComponent extends PureComponent {
    static propTypes = {
        show: PropTypes.bool
    }

    render () {
        const { show = false } = this.props;

        return (
            show &&
            <div className='loader'>
            </div>
        );
    }
}
