import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';

import CONFIG from 'config';
import { MoexProvider } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import {InputAutoSuggestion} from './components/StockSelector';

import "./index.styl";

export class StockAnalysisPage extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            securities: undefined,
            candles: undefined,
            stockName: 'ГАЗП',
            stockId: 'GAZP',
            stockHistory: undefined,
            startDate: '2018-07-01'
        };

        this.findStockByName = debounce(this.findStockByName, 200);
    }

    async componentDidMount() {

        const { stockId, startDate, stockName } = this.state;


        const securities = await this.findStockByName(stockName);

        this.setState({ securities });

        const stockHistory = await this.getStockHistory(stockId, startDate);

        this.setState({ stockHistory });
    }

    findStockByName = async (stockNamePart) => {
        const res = await MoexProvider.findStock(stockNamePart);

        if (res.data && res.data.securities) {
            res.data.securities.data = res.data.securities.data.filter((value, index, self) => self.findIndex(el => el[0] === value[0]) === index);

            return res.data.securities;
        }

        return undefined;
    };

    getStockHistory = async (stockId, startDate) => {

        const resHist = await MoexProvider.getStockHistory(stockId, startDate);

        const histData = resHist.data.candles && resHist.data.candles.data.length ? resHist.data.candles.data.map((item => {
            return {
                "date": new Date(item[6]),
                "open": item[0],
                "high": item[2],
                "low": item[3],
                "close": item[1],
                "volume": item[5],
            };
        })) : undefined;

        return {
            stockId: stockId,
            candles: histData
        };
    };

    handleStockFind = async (e) => {

        const stockName = e.target.value;

        this.setState({
            stockName
        });

        const securities = await this.findStockByName(stockName);

        this.setState({
            securities
        });
    };

    handleStockIdChange = (e) => {
        this.setState({
            stockId: e.target.value
        });
    };

    handleGetStockHistory = async () => {
        const { stockId, startDate } = this.state;

        const stockHistory = await this.getStockHistory(stockId, startDate);

        this.setState({ stockHistory });
    };

    changeStockId = (newStockId) => {
    };

    handleAddStock = (newStockId) => {
        this.setState({
            stockId: newStockId
        });
    };

    render = () => {

        const { securities, stockHistory, stockId, stockName } = this.state;

        return (
            <div className='dark stock-analysis'>

                <InputAutoSuggestion onChange={this.changeStockId} onAdd={this.handleAddStock}></InputAutoSuggestion>

                <div className='stock-id-input'>
                    <span>Find stock by name</span>
                    <input className='stock-id-input_input' value={stockName} onChange={this.handleStockFind} />
                    <br />
                </div>

                <div>Number of stocks: {securities && securities.data.length && securities.data.length}</div>

                <div className='stock-description_container'>
                    {securities && securities.data.map((item, key) => {
                        return (
                            <div className='stock-description_item' key={item[1] + key}>
                                <span className='stock-description_cell'>{item[0]}</span>
                                <span className='stock-description_cell'>{item[1]}</span>
                                <span className='stock-description_cell'>{item[4]}</span>
                            </div>
                        );
                    })}
                </div>

                <div className='stock-id-input'>
                    <span>Type stock code</span>
                    <input className='stock-id-input_input' value={stockId} onChange={this.handleStockIdChange} />
                    <br />
                    <div className='btn' onClick={this.handleGetStockHistory}>Update</div>
                </div>

                {stockHistory && <StockHistoryChartComponent data={stockHistory.candles} stockId={stockHistory.stockId} />}


            </div>
        )
    }
}


