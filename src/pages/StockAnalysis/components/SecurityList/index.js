import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./index.styl";

import { SecurityDescriptionComponent } from '../SecurityDescription';


export class SecurityListComponent extends Component {

    constructor(props) {
        super(props);
    }

    render = () => {

        const {securityItems, onDelete, onCheck} = this.props;

        return (
            <div className='securities-list'>
                {securityItems && securityItems.length && securityItems.map((item) =>{
                    return (<div className='securities-list_item' key={item.securityId}>
                        <SecurityDescriptionComponent 
                                securityItem={item} 
                                onDelete={this.props.onDelete} 
                                onCheck={this.props.onCheck} />
                    </div>);
                })}
            </div>
        );

    };
    

};
    
SecurityListComponent.propTypes = {

};