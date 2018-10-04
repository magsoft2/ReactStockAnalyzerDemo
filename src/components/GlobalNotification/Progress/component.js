import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//import './index.styl';

import { getProgressTick } from '../reducers';


@connect( ( state ) => {
    return {
        progressTick: getProgressTick(state)
    };
})
class GlobalProgressComponent extends PureComponent {
    static propTypes = {
        progressTick: PropTypes.number
    }

    render () {
        const { progressTick = 0 } = this.props;

        if(!progressTick || progressTick < 0)
            return null;

        return (            
            <div>
                {progressTick} %
            </div>
        );
    }
}

export { GlobalProgressComponent };