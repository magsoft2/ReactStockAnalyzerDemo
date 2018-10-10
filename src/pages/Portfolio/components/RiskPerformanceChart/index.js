import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore( ReactHighcharts.Highcharts );

import { themeHighCharts } from '../theme';

export default class RiskPerformanceChart extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object,
        positions: PropTypes.array
    };

    constructor (props) {

        super(props);

        this.options = {
            series: [],

            ...themeHighCharts,

            chart: {
                ...themeHighCharts.chart,
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

            title: {
                ...themeHighCharts.title,
                text: 'Portfolio Risk-Performance'
            },

            xAxis: {
                ...themeHighCharts.xAxis,
                title: {
                    text: 'Risk'
                }
            },

            tooltip: {
                ...themeHighCharts.tooltip,
                pointFormat: '{point.name}:<br/>Vol: <b>{point.x} <br/>Perf: {point.y} %</br><br/>Mav: {point.z}',
                valueSuffix: '',
                shared: true
            },

            yAxis: {
                ...themeHighCharts.yAxis,
                title: {
                    text: 'Performance'
                }
            },

            legend: {
                ...themeHighCharts.legend,
                enabled: true,
                align: 'top',
                layout: 'horizontal',
                verticalAlign: 'top',
                y: 0,
                x: 80,
                shadow: true
            },

            height: 300 // Not working!
        };

    }

    render () {
        const { positions, calculatedData, referenceData } = this.props;

        this.options.series = [];

        if ( !calculatedData || !calculatedData.history ) return null;

        if ( positions ) {

            this.options.series.push( {
                data: positions.map( a => {
                    return {
                        name: a.securityId,
                        x: _.round(a.calculatedData.volatility, 2),
                        y: _.round(a.calculatedData.performance, 2),
                        z: _.round(a.calculatedData.marketValue),
                        country: a.securityId
                    };
                } )
            }
            );
        }
        // if (referenceData && referenceData.history) {
        //     options.series.push({
        //         name: referenceData.history.securityId,
        //         data: referenceData.history.candles.map(a => {
        //             return [a.date.getTime(), a.close];
        //         })
        //     });
        // }


        return <ReactHighcharts config={ this.options } />;
    }
}
