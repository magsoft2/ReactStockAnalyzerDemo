import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './index.styl';

export class WarningBadgeComponent extends PureComponent {
    static propTypes = {
        message: PropTypes.string,
    }


    static defaultProps = {
        message: ''
    }


    render () {
        const { message } = this.props;

        return (
            <div className='warning-badge__container'>
                <div className='warning-badge__item'>{ message }</div>
            </div>
        );
    }
}

export default WarningBadgeComponent;