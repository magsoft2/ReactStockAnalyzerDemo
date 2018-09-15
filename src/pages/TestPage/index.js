import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import debounce from 'lodash/debounce';

// import {
//     Charts,
//     ChartContainer,
//     ChartRow,
//     YAxis,
//     LineChart
// } from "react-timeseries-charts";
// import { TimeSeries, TimeRange } from "pondjs";

import {CandleStickStockScaleChartWithVolumeBarV3} from '../../components/CandleStickChart/Chart';

import CONFIG from 'config';

import {MoexProvider} from 'Services';

import "./index.styl";

export class TestPage extends PureComponent {
    static contextTypes: {
    };

    constructor(props) {
        super(props);

        this.state = {
            securities: undefined,
            candles: undefined,
            stockId: 'GAZP'
        };
    }
    
    async componentDidMount() {

        const {stockId} = this.state;

        const res = await MoexProvider.findStock('ГАЗП');

        if(res.data.securities){
            res.data.securities.data = res.data.securities.data.filter((value, index, self) => self.findIndex(el => el[0] === value[0]) === index);
        }

        this.setState({securities:res.data.securities});

        const resHist = await MoexProvider.getStockHistory(stockId, '2018-07-01');

        this.setState({candles:resHist.data.candles});
    }

    handleStockIdChange = (e)=>{
        this.setState({
            stockId: e.target.value
        });
    };

    getStockHistory = async() => {
        const {stockId} = this.state;

        const resHist = await MoexProvider.getStockHistory(stockId, '2018-07-01');

        this.setState({candles:resHist.data.candles});
    };

                     
    render = () => {

        const {securities, candles, stockId} = this.state;

        const data = candles && candles.data.length ? candles.data.map((item => 
            { 
                return { 
                    "date":new Date(item[6]),
                    "open": item[0],
                    "high": item[2],
                    "low": item[3],
                    "close": item[1],
                    "volume": item[5],
                }; 
            })) : undefined;

        //console.log('securities: '+JSON.stringify(securities));

        return (
            <div className='stock-analysis'>
                
                <div>Test page</div>
                
                <div>Number of stocks: {securities && securities.data.length && securities.data.length}</div>
                <div>Number of candles for stock {stockId}: {candles && candles.data.length && candles.data.length}</div>
                
                <div className='stock-description_container'>
                    {securities && securities.data.map( (item, key) => {
                            return (
                                <div className='stock-description_item' key={item[1]+key}>
                                    <span className='stock-description_cell'>{item[0]}</span> 
                                    <span className='stock-description_cell'>{item[1]}</span>
                                    <span className='stock-description_cell'>{item[4]}</span>
                                </div>
                            );
                    })}
                </div>
                
                <div className='stock-id-input'>
                    <span>Type stock code</span>
                    <input className='stock-id-input_input' value={stockId} onChange={this.handleStockIdChange}/>
                    <br/>
                    <div className='btn' onClick={this.getStockHistory}>Update</div>
                </div>

                {/* <ChartContainer timeRange={timeseries.range()} width={800}>
                    <ChartRow height="200">
                        <YAxis id="axis1" label="in" min={0.0} max={100.0} width="60" type="linear" />
                        <Charts>
                            <LineChart axis="axis1" series={timeseries} column={["in"]}/>
                        </Charts>
                        { <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>}
                    { </ChartRow> /}
                </ChartContainer> */}

                { data && <CandleStickStockScaleChartWithVolumeBarV3 type='svg' data={data} /> }

            </div>
        )
    }
}

export default TestPage;
