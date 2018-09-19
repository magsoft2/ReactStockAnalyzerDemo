import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';

import CONFIG from 'config';

import { SecurityService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityDescriptionComponent } from './components/SecurityDescription';

import "./index.styl";

export class StockAnalysisPage extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            securities: undefined,
            candles: undefined,
            securityName: 'ГАЗП',
            securityItem: { securityId: 'GAZP', group: 'stock_shares'},
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
        const { securityItem, startDate } = this.state;

        const securityHistory = await this.getSecurityHistory(securityItem, startDate);

        this.setState({ securityHistory });
    };

    handleAddSecurity = async(newSecurityId, item) => {
        this.setState({
            securityItem: item
        });

        const securityDescription = await SecurityService.getSecurityDescription(newSecurityId);

        this.setState({
            securityDescription
        });

    };

    render = () => {

        const { securities, securityHistory, securityName, securityItem, securityDescription } = this.state;

        return (
            <div className='dark stock-analysis'>

                <SecuritySelectorComponent onAdd={this.handleAddSecurity}/>

                <SecurityDescriptionComponent securityDescription={securityDescription} securityItem={securityItem} />

                <div>
                    <div className='btn' onClick={this.handleGetSecurityHistory}>Update chart</div>
                </div>

                {securityHistory && <StockHistoryChartComponent data={securityHistory.candles} securityId={securityHistory.securityId} />}


            </div>
        )
    }
}


