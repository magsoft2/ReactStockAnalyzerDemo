import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//import './index.styl';

import { getMessage } from '../reducers';


@connect( ( state ) => {
    return {
        message: getMessage(state)
    };
})
class GLobalMessageComponent extends PureComponent {
    static propTypes = {
        message: PropTypes.string
    }

    static defaultProps = {
        message: ''
    }

    render () {
        const { message = '' } = this.props;

        if(!message)
            return null;

        return (            
            <div>
                {message}
            </div>
        );
    }
}

export { GLobalMessageComponent };