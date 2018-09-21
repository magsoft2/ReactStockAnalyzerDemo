import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./index.styl";


export class SecurityDescriptionComponent extends Component {

    constructor(props) {
        super(props);

        this.state = { isCollapsed: true };
    }
    

    handleClick = () => this.setState( { isCollapsed: !this.state.isCollapsed } );

    handleCheck = () => this.props.onCheck(this.props.securityItem.securityId);
    
    handleDelete = () => this.props.onDelete(this.props.securityItem.securityId);


    render() {

        const {securityItem} = this.props;
        const isCollapsedClass = this.state.isCollapsed ? ' collapsed' : '';

        const securityDescription = securityItem.securityDescription;

        return (
            <div className='security-desc_container'>
                <div className='security-desc_check' onClick={this.handleCheck}>{securityItem.selected ? (<span>&#x2714;</span>) : (<span>&#x2610;</span>) }</div>
                <div className='security-desc_name'>{securityItem && securityItem.securityDef.name}</div>
                {securityDescription && <div className={'security-desc_btn' + isCollapsedClass} onClick={this.handleClick}> ?</div>}
                { 
                    securityDescription && 
                    <div className='security-desc_tooltip_container'>
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
                <div className="security-desc_filler"/>
                <div className='security-desc_delete' onClick={this.handleDelete}>&#x2715;</div>
            </div>
        );
    };

};

SecurityDescriptionComponent.propTypes = {

};