import React, { PureComponent } from 'react';

import './index.styl';

import { SecuritySelectorComponent } from 'components/SecuritySelector';
import { PropTypes } from 'prop-types';


export default class StockControlPanel extends PureComponent {

    static propTypes = {
        onAddSecurity: PropTypes.func,
        onUpdateAll: PropTypes.func
    };

    render () {
        return (
            <div className='stock__control-panel'>
                <SecuritySelectorComponent onAdd={ this.props.onAddSecurity } />

                {!!this.props.children && <div className='stock__control-panel__separator'>&nbsp;</div>}
                {this.props.children}
                
                <div className='stock__control-panel__separator'>&nbsp;</div>
                <div className='stock__control-panel__btn' 
                    onClick={ this.props.onUpdateAll } 
                    title='Обновить все данные'><span>&#x27F3;</span> Update all data
                </div>
            </div>
        );
    }
}

export {StockControlPanel};
