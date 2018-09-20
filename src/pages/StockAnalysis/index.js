import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';
import {Helmet} from 'react-helmet';

import CONFIG from 'config';

import { SecurityService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityDescriptionComponent } from './components/SecurityDescription';

import "./index.styl";

export class StockAnalysisPage extends PureComponent {

    constructor(props) {
        super(props);

        const securityItem = { 
            securityId: 'GAZP', 
            group: 'stock_shares'
        };

        this.state = {
            securities: undefined,
            candles: undefined,
            securityName: 'ГАЗП',
            securityItem,
            securityItems:[
                {
                    securityId: securityItem.securityId,
                    securityItem,
                    securityHistory: undefined,
                    securityDescription: undefined
                }],
            securityHistory: undefined,
            securityDescription: undefined,
            startDate: '2018-07-01'
        };

        //this.findStockByName = debounce(this.findStockByName, 200);
    }

    async componentDidMount() {

        const { securityItem, startDate, securityName } = this.state;

        const securityHistory = await this.getSecurityHistory(securityItem, startDate);

        this.setState({ securityHistory });
    }

    getSecurityHistory = async (securityItem, startDate) => {

        const resHist = await SecurityService.getSecurityHistory(securityItem.securityId, securityItem.group, startDate);

        return {
            securityId: securityItem.securityId,
            candles: resHist
        };
    };


    handleGetSecurityHistory = async () => {
        const { securityItem, startDate, securityItems } = this.state;

        const securityHistory = await this.getSecurityHistory(securityItem, startDate);

        let list = this.updateOrAddItemToList(securityItems, securityItem, securityHistory, undefined);

        this.setState(
            { 
                securityHistory,
                securityItems: list
            });
    };

    updateOrAddItemToList = (list, itemNew, history, description) => {

        if(!itemNew)
            return list;

        let item = list.filter(a => a.securityId == itemNew.securityId);
        if(!item || !item.length){
            item = {
                securityId: itemNew.securityId
            };
            list.unshift(item);
        }else{
            item = item[0];
        };
        item.securityItem = itemNew;
        item.securityHistory = history ? history : item.securityHistory;
        item.securityDescription = description ? description : item.securityDescription;

        return list;
    };

    handleAddSecurity = async(newSecurityId, item) => {

        const {securityItems} = this.state;

        let list = this.updateOrAddItemToList(securityItems, item);

        this.setState({
            securityItem: item,
            securityItems: list
        });

        const securityDescription = await SecurityService.getSecurityDescription(newSecurityId);

        list = this.updateOrAddItemToList(list, item, undefined, securityDescription);

        this.setState({
            securityDescription,
            securityItems: list
        });

    };

    render = () => {

        const { securities, securityItems, securityHistory, securityName, securityItem, securityDescription } = this.state;

        return (
            <div className='dark stock-analysis'>

                <Helmet>
                    <title>Demo stock analysis app</title>
                </Helmet>

                <SecuritySelectorComponent onAdd={this.handleAddSecurity}/>

                <div className='securities-list'>
                    {securityItems && securityItems.length && securityItems.map((item) =>{
                        return (<div className='securities-list_item' key={item.securityId}>
                            <SecurityDescriptionComponent securityDescription={item.securityDescription} securityItem={item.securityItem} />
                        </div>);
                    })}
                </div>

                <div>
                    <div className='btn' onClick={this.handleGetSecurityHistory}>Update chart</div>
                </div>

                {securityHistory && <StockHistoryChartComponent data={securityHistory.candles} securityId={securityHistory.securityId} />}


            </div>
        )
    }
}


