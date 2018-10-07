import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { SecurityDescriptionComponent } from 'components/SecurityDescription';

import './index.styl';


export class SecurityListItemComponent extends Component {

    constructor ( props ) {
        super( props );
    }

    static propTypes = {
        onCheck: PropTypes.func,
        onDelete: PropTypes.func,
        securityItem: PropTypes.object
    };


    handleCheck = () => this.props.onCheck( this.props.securityItem.securityId );

    handleDelete = () => this.props.onDelete( this.props.securityItem.securityId );


    render () {
        const { securityItem } = this.props;

        return (
            <div className='security-list__item'>
                <div className='security-list__cell_check' onClick={ this.handleCheck }>{ securityItem.selected ? ( <span>&#10687;</span> ) : ( <span>&#10686;</span> ) }</div>
                <SecurityDescriptionComponent securityItem={ securityItem } />
                <div className="security-list__cell_filler" />
                <div className='security-list__cell_delete' onClick={ this.handleDelete }>&#x2715;</div>
            </div>
        );
    }

}

