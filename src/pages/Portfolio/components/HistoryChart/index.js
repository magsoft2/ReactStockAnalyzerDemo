import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import { themeHighCharts } from '../theme';


export default class HistoryChartComponent extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object,
        indexes: PropTypes.array
    };

    constructor (props) {
        super(props);

        this.state = {
            refrenceId: undefined
        };
    }

    getOptions = () => {
        return {
            title: {
                text: 'Portfolio'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [],
            ...themeHighCharts,
            legend: {
                ...themeHighCharts.legend,
                enabled: true,
                align: 'top',
                layout: 'horizontal',
                verticalAlign: 'top',
                y: 0,
                x: 280,
                shadow: true
            },
            height: 300
        };
    }


    handleReferenceChange = (event) => {
        this.setState( { refrenceId: event.target.value } );
        this.props.onChangeReference(event.target.value);
    };


    render () {
        const { calculatedData, referenceData, indexes } = this.props;
        const {refrenceId} = this.state;

        if ( !calculatedData || !calculatedData.history ) return null;

        const options = this.getOptions();

        if ( calculatedData.history ) {
            options.series.push( {
                name: calculatedData.history.securityId,
                data: calculatedData.history.candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            } );
        }
        if ( referenceData && referenceData.history ) {
            options.series.push( {
                name: referenceData.history.securityId,
                data: referenceData.history.candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            } );
        }

        options.rangeSelector.selected = 1;


        return (
            <div>
                <span>Reference: </span>
                <select value={ refrenceId } onChange={ this.handleReferenceChange } >
                    <option value={ undefined }> </option>
                    {!!indexes && indexes.map( ind => <option value={ ind.securityId }>{ind.securityId}</option>) }
                </select>
                <HighchartsReact highcharts={ Highcharts } constructorType={ 'stockChart' } options={ options } chart={ { height: 200 } } />
            </div>
        );
    }

    
}
