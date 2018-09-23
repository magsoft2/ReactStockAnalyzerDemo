import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.styl';

import { SecurityListItemComponent } from './../SecurityListItem/index';


export class SecurityListComponent extends Component {

    constructor(props) {
        super(props);
    }

    render = () => {

    	const {securityItems, onDelete, onCheck} = this.props;

    	return (
    		<div className='security-list'>
    			{securityItems && securityItems.length && securityItems.map((item) =>{
    				return (
                        <SecurityListItemComponent 
                            key={item.securityId}
    						securityItem={item} 
    						onDelete={onDelete} 
    						onCheck={onCheck} />
    				);
    			})}
    		</div>
    	);

    };
    

}
    
SecurityListComponent.propTypes = {
    onDelete: PropTypes.func,
    onCheck: PropTypes.func,
    securityItems: PropTypes.array
};