import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

//HighchartsMore( ReactHighcharts.Highcharts ); // use this line only once globally!

import { themeHighCharts } from '../theme';

import {Security} from 'domain/securityHelpers';

export default class FactorsPolarChart extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object,
        positions: PropTypes.array,
        indexes: PropTypes.array
    };


    constructor (props) {

        super(props);

        this.options = {
            series: [],

            ...themeHighCharts,

            chart: {
                ...themeHighCharts.chart,
                polar: true,
                type: 'line'
            },

            plotOptions: {
                series: {
                    threshold: -1.0
                }
            },
            pane: {
                size: '100%',
            },

            title: {
                ...themeHighCharts.title,
                text: 'Portfolio Factors'
            },

            legend: {
                ...themeHighCharts.legend,
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            xAxis: {
                ...themeHighCharts.xAxis,
                //categories: props.indexes.map(a=>Security.getName(a)),
                tickmarkPlacement: 'on',
                lineWidth: 0,
                labels: {
                    ...themeHighCharts.xAxis.labels,
                    distance: 15,
                    style: {
                        whiteSpace: 'nowrap',
                        fontSize: 10
                    }
                }
            },
        
            yAxis: {
                ...themeHighCharts.yAxis,
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: -1,
                max: 1
            },

            tooltip: {
                ...themeHighCharts.tooltip,
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b> {point.y:,.2f}</b><br/>'
            },
        
        };

    }

    render () {
        const { positions, calculatedData } = this.props;

        this.options.series = [];

        if ( !calculatedData || !calculatedData.history ) return null;

        
        if ( positions && calculatedData.factors ) {
            this.options.xAxis.categories = this.props.indexes.map(a=>Security.getName(a)),

            this.options.series.push( 
                {
                    type: 'line',
                    name: 'Factors',
                    data: calculatedData.factors.map(a=>a.correlation),
                    pointPlacement: 'on'
                }
            );
        }

        return <ReactHighcharts config={ this.options } />;
    }
}
