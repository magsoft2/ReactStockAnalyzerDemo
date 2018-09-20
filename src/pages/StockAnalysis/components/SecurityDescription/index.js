import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import "./index.styl";


export class SecurityDescriptionComponent extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { isCollapsed: true };
    }
    

    handleClick = () => this.setState( { isCollapsed: !this.state.isCollapsed } );


    render() {

        const {securityDescription, securityItem} = this.props;
        const isCollapsedClass = this.state.isCollapsed ? ' collapsed' : '';

        return (
            <div className='security-desc_container'>
                <span className='security-desc_name'>{securityItem && securityItem.name}</span>
                {securityDescription && <div className={'security-desc_btn' + isCollapsedClass} onClick={this.handleClick}> ?</div>}
                { 
                    securityDescription && 
                    <div>
                        <div className={'security-desc_list' + isCollapsedClass} >
                            {securityDescription.map(
                                    (item, key) => {
                                        return (
                                                <div key={key} className='security-desc_row '>
                                                    <span className='security-desc_cell__name'>{item.title}</span>
                                                    <span className='security-desc_cell__value'>{item.value}</span>
                                                </div>
                                            );
                                    }
                                )}
                        </div>
                    </div>
                }
                <span class="security-desc_filler"></span>
                <span className='security-desc_delete'>&#x2715;</span>
            </div>
        );
    };

};

SecurityDescriptionComponent.propTypes = {

};