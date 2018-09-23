import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './index.styl';


export class SecurityDescriptionComponent extends Component {

    constructor ( props ) {
        super( props );

        this.state = { isCollapsed: true };
    }

    handleClick = () => this.setState( { isCollapsed: !this.state.isCollapsed } );

    render () {

    	const { securityItem } = this.props;
    	const isCollapsedClass = this.state.isCollapsed ? ' collapsed' : '';

    	const description = securityItem.description;

    	return (
            <Fragment>
                <div className='security-desc_name'>{ securityItem && securityItem.definition && securityItem.definition.name }</div>
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
