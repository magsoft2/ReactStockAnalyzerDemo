import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import { themeHighCharts } from '../theme';

import { Security } from 'domain/securityHelpers';


export default class HistoryChartComponent extends Component {
    static propTypes = {
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object,
        indexes: PropTypes.array,
        onChangeReference: PropTypes.func
    };

    constructor ( props ) {
        super( props );
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


    handleReferenceChange = ( event ) => {
        const { indexes } = this.props;
        const id = event.target.value;

        let item = undefined;
        if ( indexes ) {
            item = indexes.find( a => a.securityId === id );
        }
        this.props.onChangeReference( id, item );
    };


    render () {
        const { calculatedData, referenceData, indexes } = this.props;

        if ( !calculatedData || !calculatedData.history ) return null;

        const options = this.getOptions();


        if ( referenceData && referenceData.referenceSecurityItem && referenceData.referenceHistoryProc ) {
            options.series.push( {
                name: referenceData.referenceHistoryProc.securityId,
                data: referenceData.referenceHistoryProc.candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            } );
        }

        if ( calculatedData.history ) {
            options.series.push( {
                name: calculatedData.history.securityId,
                data: (referenceData && referenceData.referenceHistoryProc ? calculatedData.historyProc : calculatedData.history).candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            } );
        }

        if(!referenceData.referenceSecurityItem) {
            options.rangeSelector.selected = 1;
        }

        const referenceId = referenceData.referenceSecurityItem ? referenceData.referenceSecurityItem.securityId : undefined ;

        return (
            <div>
                <span>Reference: </span>
                <select value={ referenceId } onChange={ this.handleReferenceChange } >
                    <option value={ undefined }> </option>
                    { !!indexes && indexes.map( ind => <option key={ ind.securityId } value={ ind.securityId }>{ Security.getName( ind ) }</option> ) }
                </select>
                <HighchartsReact highcharts={ Highcharts } constructorType={ 'stockChart' } options={ options } chart={ { height: 200 } } />
            </div>
        );
    }


}
