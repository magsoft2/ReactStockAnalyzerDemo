import React, { Component } from "react";
import PropTypes from "prop-types";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ReactHighcharts from "react-highcharts";
import HighchartsMore from 'highcharts-more';

HighchartsMore(ReactHighcharts.Highcharts);

import { themeHighCharts } from "../theme";

export default class RiskPerformanceChart extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object,
        positions: PropTypes.array
    };

    render() {
        const { positions, calculatedData, referenceData } = this.props;

        if (!calculatedData || !calculatedData.history) return null;

        const options = {
            title: {
                text: "Portfolio"
            },
            // xAxis: {
            //     type: "datetime"
            // },
            series: [],

            ...themeHighCharts,

            chart: {
                type: "bubble",
                plotBorderWidth: 1,
                zoomType: 'xy'
            },


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

        if (positions) {
            options.series.push({
                data: positions.map(a => {
                    return {
                        name: a.securityId,
                        x: a.calculatedData.volatility,
                        y: a.calculatedData.performance,
                        z: a.calculatedData.marketValue,
                        country: a.securityId
                    };
                })
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

        //options.rangeSelector.selected = 1;

        const config = {
            
            //series: [{data: options.series}],
            

           ...themeHighCharts,

           chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },


           xAxis: {
            //categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          },
          series: [{
            
            data: positions.map(a => {
                return {
                    name: a.securityId,
                    x: a.calculatedData.volatility,
                    y: a.calculatedData.performance,
                    z: a.calculatedData.marketValue,
                    country: a.securityId
                };
            })
            
            // [                
            //     { x: 95, y: 95, z: 13.8, name: "BE", country: "Belgium" },
            //             { x: 86.5, y: 102.9, z: 14.7, name: "DE", country: "Germany" },
            //             { x: 80.8, y: 91.5, z: 15.8, name: "FI", country: "Finland" }
            // ]

            

          }],

        //   chart: {
        //     type: "bubble"
        //     },
          /*
            chart: {
                type: "bubble",
                plotBorderWidth: 1,
                zoomType: "xy"
            },

            series: [
                {
                    data: [
                        { x: 95, y: 95, z: 13.8, name: "BE", country: "Belgium" },
                        { x: 86.5, y: 102.9, z: 14.7, name: "DE", country: "Germany" },
                        { x: 80.8, y: 91.5, z: 15.8, name: "FI", country: "Finland" },
                        { x: 80.4, y: 102.5, z: 12, name: "NL", country: "Netherlands" },
                        { x: 80.3, y: 86.1, z: 11.8, name: "SE", country: "Sweden" },
                        { x: 78.4, y: 70.1, z: 16.6, name: "ES", country: "Spain" },
                        { x: 74.2, y: 68.5, z: 14.5, name: "FR", country: "France" },
                        { x: 73.5, y: 83.1, z: 10, name: "NO", country: "Norway" },
                        { x: 71, y: 93.2, z: 24.7, name: "UK", country: "United Kingdom" },
                        { x: 69.2, y: 57.6, z: 10.4, name: "IT", country: "Italy" },
                        { x: 68.6, y: 20, z: 16, name: "RU", country: "Russia" },
                        { x: 65.5, y: 126.4, z: 35.3, name: "US", country: "United States" },
                        { x: 65.4, y: 50.8, z: 28.5, name: "HU", country: "Hungary" },
                        { x: 63.4, y: 51.8, z: 15.4, name: "PT", country: "Portugal" },
                        { x: 64, y: 82.9, z: 31.3, name: "NZ", country: "New Zealand" }
                    ]
                }
            ]
            */
        };

        console.log(config);

        return <ReactHighcharts config={options} />;
    }
}
