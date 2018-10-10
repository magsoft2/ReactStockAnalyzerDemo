import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ReactHighcharts from 'react-highcharts';
import HighchartsMore from 'highcharts-more';

HighchartsMore( ReactHighcharts.Highcharts );

import { themeHighCharts } from '../theme';

export default class FactorsPolarChart extends Component {
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
                polar: true,
                //type: 'line'
            },

            pane: {
                size: '80%'
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
                categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
                    'Information Technology', 'Administration'],
                tickmarkPlacement: 'on',
                lineWidth: 0
            },
        
            yAxis: {
                ...themeHighCharts.yAxis,
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                ...themeHighCharts.tooltip,
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
            },
        
        };

    }

    render () {
        const { positions, calculatedData, referenceData } = this.props;

        this.options.series = [];

        if ( !calculatedData || !calculatedData.history ) return null;

        
        if ( positions ) {
            this.options.series.push( 
                {
                    type: 'area',
                    name: 'Factors',
                    data: [43000, 19000, 60000, 35000, 17000, 10000],
                    pointPlacement: 'on'
                }
            );
        }

        return <ReactHighcharts config={ this.options } />;
    }
}
