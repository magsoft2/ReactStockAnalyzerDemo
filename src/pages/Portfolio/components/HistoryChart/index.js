import React, { Component } from "react";
import PropTypes from "prop-types";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import { themeHighCharts } from "../theme";



export default class HistoryChartComponent extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object
    };

    render() {
        const { calculatedData, referenceData } = this.props;

        if (!calculatedData || !calculatedData.history) return null;

        const options = {
            title: {
                text: "Portfolio"
            },
            xAxis: {
                type: "datetime"
            },
            series: [],

            ...themeHighCharts,

            legend: {
                ...themeHighCharts.legend,
                enabled: true,
                align: "top",
                layout: "horizontal",
                verticalAlign: "top",
                y: 0,
                x: 280,
                shadow: true
            },

            height: 300 // Not working!
        };

        if (calculatedData.history) {
            options.series.push({
                name: calculatedData.history.securityId,
                data: calculatedData.history.candles.map(a => {
                    return [a.date.getTime(), a.close];
                })
            });
        }
        if (referenceData && referenceData.history) {
            options.series.push({
                name: referenceData.history.securityId,
                data: referenceData.history.candles.map(a => {
                    return [a.date.getTime(), a.close];
                })
            });
        }

        options.rangeSelector.selected = 1;

        return (
                <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={options} chart={{ height: 200 }} />
        );
    }
}
