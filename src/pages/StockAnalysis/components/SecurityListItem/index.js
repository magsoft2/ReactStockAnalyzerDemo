import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SecurityDescriptionComponent } from '../SecurityDescription';

import './index.styl';


export class SecurityListItemComponent extends Component {

    constructor ( props ) {
        super( props );
    }


    handleCheck = () => this.props.onCheck( this.props.securityItem.securityId );

    handleDelete = () => this.props.onDelete( this.props.securityItem.securityId );


    render () {
    	const { securityItem } = this.props;

    	return (
    		<div className='security-list__item'>
    			<div className='security-list__cell_check' onClick={ this.handleCheck }>{ securityItem.selected ? ( <span>&#x2714;</span> ) : ( <span>&#x2610;</span> ) }</div>
                <SecurityDescriptionComponent securityItem={securityItem} />
    			<div className="security-list__cell_filler" />
    			<div className='security-list__cell_delete' onClick={ this.handleDelete }>&#x2715;</div>
    		</div>
    	);
    }

}

SecurityListItemComponent.propTypes = {
    onCheck: PropTypes.func,
    onDelete :PropTypes.func,
    securityItem: PropTypes.object
};
