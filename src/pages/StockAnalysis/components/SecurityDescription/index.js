import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './index.styl';


export class SecurityDescriptionComponent extends Component {

    constructor ( props ) {
        super( props );

        this.state = { isCollapsed: true };
    }

    handleClick = () => this.setState( { isCollapsed: !this.state.isCollapsed } );

    getStockName = (item) => {
        if(!item)
            return null;

        if(item.description){
            //TODO: make mapping of table to stock fields
            const raw = item.description.find(a => a.name ==='NAME');
            if(raw)
                return raw.value;
        }

        return item.definition && item.definition.name ? item.definition.name : item.securityId;
    }

    render () {

    	const { securityItem } = this.props;
    	const isCollapsedClass = this.state.isCollapsed ? ' collapsed' : '';

    	const description = securityItem.description;


    	return (
            <Fragment>
                <span className='security-desc_name'>{ this.getStockName(securityItem) }</span>
    			{ description && <div className={ 'security-desc_btn' + isCollapsedClass } onClick={ this.handleClick }> ?</div> }
    			{
    				description &&
                    <div className='security-desc_tooltip_container'>
                    	<div className={ 'security-desc_list' + isCollapsedClass } >
                    		{ description.map(
                    			( item, key ) => {
                    				return (
                    					<div key={ key } className='security-desc_row '>
                    						<span className='security-desc_cell__name'>{ item.title }</span>
                    						<span className='security-desc_cell__value'>{ item.value }</span>
                    					</div>
                    				);
                    			}
                    		) }
                    	</div>
                    </div>
                }
            </Fragment>
    	);
    }
}

SecurityDescriptionComponent.propTypes = {
    securityItem: PropTypes.object
};
