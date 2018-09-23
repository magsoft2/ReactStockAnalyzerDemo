import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './index.styl';

import {CONSTANTS} from '../../../../constants';


export class IndicatorCtorComponent extends PureComponent {

    constructor ( props ) {
        super( props );

        this.state = { 
            type: CONSTANTS.INDICATOR_TYPES.EMA,
            window: 20
        };
    }

    handleClick = () => {
        const {type, window} = this.state;

        this.props.onAdd({
            type,
            window,
            key: `${type}_${window}`
        });
    };

    handleTypeChange = (event) => {
        this.setState({ type: Number(event.target.value) });
    };

    handleWindowChange = (event) => {
        this.setState({ window: Number(event.target.value) });
    };


    render () {

    	const {type, window} = this.state;

    	return (
            <div className={ 'indicator-ctor'}>
                <div className='indicator-ctor__label'> Add indicator: </div>
                <select className='indicator-ctor__type' value={type} onChange={this.handleTypeChange} >
                    <option value={CONSTANTS.INDICATOR_TYPES.SMA}>SMA</option>
                    <option value={CONSTANTS.INDICATOR_TYPES.EMA}>EMA</option>
                    <option value={CONSTANTS.INDICATOR_TYPES.TMA}>TMA</option>
                    <option value={CONSTANTS.INDICATOR_TYPES.WMA}>WMA</option>
                </select>
                <div className='indicator-ctor__label'>   Window: </div>
                <input className='indicator-ctor__window' min='3' max='200' type={'number'} value={window} onChange={this.handleWindowChange} />
                <div className={ 'indicator-ctor__btn' } onClick={ this.handleClick } title='Add selected indicator. Delete by click on chart.'>+</div>
            </div>
    	);
    }
}

IndicatorCtorComponent.propTypes = {
    onAdd: PropTypes.func.isRequired
};
