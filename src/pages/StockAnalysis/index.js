import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';

import CONFIG from 'config';
import { StockService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import {StockSelectorComponent} from './components/StockSelector';

import "./index.styl";

export class StockAnalysisPage extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            securities: undefined,
            candles: undefined,
            stockName: 'ГАЗП',
            stockItem: { securityId: 'GAZP', group: 'stock_shares'},
            stockHistory: undefined,
            stockDescription: undefined,
            startDate: '2018-07-01'
        };

        //this.findStockByName = debounce(this.findStockByName, 200);
    }

    async componentDidMount() {

        const { stockItem, startDate, stockName } = this.state;

        const stockHistory = await this.getStockHistory(stockItem, startDate);

        this.setState({ stockHistory });
    }

    getStockHistory = async (stockItem, startDate) => {

        const resHist = await StockService.getStockHistory(stockItem.securityId, stockItem.group, startDate);

        return {
            securityId: stockItem.securityId,
            candles: resHist
        };
    };


    handleGetStockHistory = async () => {
        const { stockItem, startDate } = this.state;

        const stockHistory = await this.getStockHistory(stockItem, startDate);

        this.setState({ stockHistory });
    };

    handleAddStock = async(newStockId, item) => {
        this.setState({
            stockItem: item
        });

        const stockDescription = await StockService.getStockDescription(newStockId);

        this.setState({
            stockDescription
        });

    };

    render = () => {

        const { securities, stockHistory, stockName, stockItem, stockDescription } = this.state;

    console.log("stockDescription: "+JSON.stringify(stockDescription));

        return (
            <div className='dark stock-analysis'>

                <StockSelectorComponent onAdd={this.handleAddStock}/>

                { stockDescription && <div>
                        <a className="tooltip" href="#">Security info
                        <span>
                            {stockDescription.map((item => {
                                return (<div>{JSON.stringify(item)}</div>);
                            }))}
                        </span></a>.
                    </div>
                }

                <div className='stock-id-input'>
                    {/* <input className='stock-id-input_input' value={stockItem.securityId} readOnly/> */}
                    <span>{stockItem && stockItem.name}</span>
                    <br />
                    <div className='btn' onClick={this.handleGetStockHistory}>Update chart</div>
                </div>

                {stockHistory && <StockHistoryChartComponent data={stockHistory.candles} securityId={stockHistory.securityId} />}


            </div>
        )
    }
}


