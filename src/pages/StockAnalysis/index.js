import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';
import {Helmet} from 'react-helmet';

import CONFIG from 'config';

import { SecurityService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityListComponent } from './components/SecurityList';

import "./index.styl";

export class StockAnalysisPage extends Component {

    constructor(props) {
        super(props);

        const securityDef = { 
            securityId: 'GAZP', 
            name: 'GAZP',
            group: 'stock_shares'
        };

        this.state = {
            securityItems:[
                {
                    securityId: securityDef.securityId,
                    selected: true,
                    securityDef,
                    securityHistory: undefined,
                    securityDescription: undefined
                }],
            startDate: '2018-07-01'
        };

        //this.findStockByName = debounce(this.findStockByName, 200);
    }

    async componentDidMount() {

        const { securityItems, startDate } = this.state;

        const securityDescription = await SecurityService.getSecurityDescription(securityItems[0].securityId);
        const securityHistory = await this.getSecurityHistory(securityItems[0].securityId, securityItems[0].securityDef.group, startDate);

        const list = this.updateOrAddItemToList(securityItems, securityItems[0].securityDef, securityHistory, securityDescription);

        this.setState({ securityItems:list });
    }

    getSecurityHistory = async (securityId, securityGroup, startDate) => {

        const resHist = await SecurityService.getSecurityHistory(securityId, securityGroup, startDate);

        return {
            securityId: securityId,
            candles: resHist
        };
    };

    findItemByIdInList = (id, list) => {
        
        if(list && list.length){
            let item = list.filter(a => a.securityId == id);
            if(item && item.length){
                return item[0];
            };
        }
        
        return undefined;
    };

    handleGetSecurityHistory = async () => {
        const { startDate, securityItems } = this.state;

        if(!securityItems || !securityItems.length)
            return;

        const securityHistory = await this.getSecurityHistory(securityItems[0].securityId, securityItems[0].securityDef.group, startDate);

        const list = this.updateOrAddItemToList(securityItems, securityItems[0].securityDef, securityHistory, undefined);

        this.setState(
            { 
                securityItems: list
            });
    };

    updateOrAddItemToList = (list, itemNew, history, description) => {

        if(!itemNew)
            return list;

        let item = this.findItemByIdInList(itemNew.securityId, list);
        if(!item){
            item = {
                securityId: itemNew.securityId
            };
            list.unshift(item);
        }
        item.securityDef = itemNew;
        item.securityHistory = history ? history : item.securityHistory;
        item.securityDescription = description ? description : item.securityDescription;

        return list;
    };

    handleAddSecurity = async(newSecurityId, item) => {

        const {securityItems, startDate} = this.state;

        if(securityItems && securityItems.length > 20)
            return;

        let list = this.updateOrAddItemToList(securityItems, item);

        let itemTemp = this.findItemByIdInList(item.securityId, list);
        if(itemTemp){
            itemTemp.selected = true;
        }
        
        this.setState({
            securityItems: list
        });

        const securityDescription = await SecurityService.getSecurityDescription(item.securityId);
        const securityHistory = await this.getSecurityHistory(item.securityId, item.group, startDate);

        list = this.updateOrAddItemToList(list, item, securityHistory, securityDescription);

        this.setState({
            securityItems: list
        });

    };

    handleDeleteItem = (id) => {
        const {securityItems} = this.state;

        if(securityItems && securityItems.length){
            const newList = securityItems.filter(a => a.securityId !== id);
            this.setState({securityItems: newList});
        }
    };

    handleCheckItem = (id) => {
        
        const {securityItems} = this.state;

        const item = this.findItemByIdInList(id, securityItems);

        if(item){
            item.selected = !item.selected;
            this.setState({securityItems});
        }
    };

    
    render = () => {

        const { securityItems } = this.state;

        return (
            <div className='dark stock-analysis'>

                <Helmet>
                    <title>Demo stock analysis app</title>
                </Helmet>

                <SecuritySelectorComponent onAdd={this.handleAddSecurity}/>

                <br/>
                <SecurityListComponent securityItems={securityItems} onDelete={this.handleDeleteItem} onCheck={this.handleCheckItem} />

                <div>
                    <div className='btn' onClick={this.handleGetSecurityHistory} title='Обновить график'>&#x27F3;</div>
                </div>

                <StockHistoryChartComponent securityItems={securityItems} />

            </div>
        )
    }
}


