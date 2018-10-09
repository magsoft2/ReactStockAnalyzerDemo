import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {
    curveLinear,
    curveStep,
    curveStepBefore,
    curveStepAfter,
    curveBasis,
    curveCardinal,
    curveMonotoneX,
    curveCatmullRom
} from 'd3-shape';
import { ChartCanvas, Chart } from 'react-stockcharts';
import {
    BarSeries,
    CandlestickSeries,
    AreaSeries,
    LineSeries
} from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { MovingAverageTooltip, HoverTooltip, SingleValueTooltip } from 'react-stockcharts/lib/tooltip';
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY
} from 'react-stockcharts/lib/coordinates';
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
import { LabelAnnotation, Label, Annotate } from 'react-stockcharts/lib/annotation';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { last, hexToRGBA, getClosestItem } from 'react-stockcharts/lib/utils';
import { ema, wma, sma, tma } from 'react-stockcharts/lib/indicator';

import { CONSTANTS } from '../../constants';

import './index.styl';


const dateFormat = timeFormat( '%Y-%m-%d' );
const numberFormat = format( '.2f' );

const chartTypes = [
    {
        id: CONSTANTS.CHART_TYPES.Candles,
        name: 'Candles'
    },
    {
        id: CONSTANTS.CHART_TYPES.Area,
        name: 'Area'
    },
    {
        id: CONSTANTS.CHART_TYPES.Line,
        name: 'Line'
    } ];

const timeRanges = [
    {
        id: CONSTANTS.TIME_RANGES.Day,
        name: 'D'
    },
    {
        id: CONSTANTS.TIME_RANGES.Week,
        name: 'W'
    },
    {
        id: CONSTANTS.TIME_RANGES.Month,
        name: 'M'
    },
    {
        id: CONSTANTS.TIME_RANGES.Month2,
        name: '2M'
    },
    {
        id: CONSTANTS.TIME_RANGES.Month3,
        name: '3M'
    },
    {
        id: CONSTANTS.TIME_RANGES.Month6,
        name: '6M'
    },
    {
        id: CONSTANTS.TIME_RANGES.Year,
        name: 'Y'
    },
];

const ChartTheme = {
    tickStroke: '#78799E',
    margin: { left: 0, right: 50, top: 10, bottom: 30 },
    raiseColor: '#6BA583',
    fallColor: '#DB0000',
    colorAreaLine: '#4286f4',
    colorAreaFill: hexToRGBA( '#4286f4', 0.1 )
};

export class StockHistoryChartComponent extends React.Component {

    constructor ( props ) {
        super( props );

        this.state = {
            chartType: CONSTANTS.CHART_TYPES.Candles,
            chartTimeRange: CONSTANTS.TIME_RANGES.Month
        };
    }

    static propTypes = {
        securityItem: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        ratio: PropTypes.number.isRequired,
        type: PropTypes.oneOf( [ 'svg', 'hybrid' ] ).isRequired,
        indicators: PropTypes.array,
        onIndicatorClick: PropTypes.func
    };
    
    static defaultProps = {
        type: 'svg',
        width: 100,
        ratio:1
    };

    handleChartType = ( event ) => {
        const { id } = event.target;
        this.setState( { chartType: Number( id ) } );
    }

    handleChartTimeRange = ( event ) => {
        const { id } = event.target;
        this.setState( { chartTimeRange: Number( id ) } );
    }

    handleIndicatorClick = ( e ) => {
        const { onIndicatorClick } = this.props;

        if ( onIndicatorClick )
            onIndicatorClick( e.key );
    };

    renderChart = ( { type, securityItem: item } ) => {
        const { width, ratio, indicators } = this.props;
        const { chartType, chartTimeRange } = this.state;

        if ( !item || !item.history )
            return null;

        const securityId = item.securityId;
        const initialData = item.history.candles;

        if ( !initialData || !initialData.length )
            return null;

        //prepare indicators
        const indicatorsPrepared = prepareIndicators( indicators );

        const calculatedData = indicatorsPrepared.reduce( ( accumulator, currentValue ) => {
            return currentValue( accumulator );
        }, initialData );

        const xScaleProvider = discontinuousTimeScaleProvider
            .inputDateAccessor( d => d.date );
        const {
            data,
            xScale,
            xAccessor,
            displayXAccessor
        } = xScaleProvider( calculatedData );

        const xExtents = calculateChartExtent( chartTimeRange, data, xAccessor );

        const height = 390;

        return (
            <ChartCanvas height={ height }
                ratio={ ratio }
                width={ width }
                margin={ ChartTheme.margin }
                type={ type }
                seriesName={ securityId }
                data={ data }
                xScale={ xScale }
                xAccessor={ xAccessor }
                displayXAccessor={ displayXAccessor }
                xExtents={ xExtents }
            >

                {/* <Label x={50} y={50} fontSize={24} text={securityId} /> */ }

                <Chart id={ 1 } height={ 280 } yExtents={ d => [ d.high, d.low ] } >
                    <YAxis axisAt="right" orient="right" ticks={ 7 } tickStroke={ ChartTheme.tickStroke } opacity={ 0.5 } />
                    {/* <YAxis axisAt="left" orient="left" showTicks={false} /> */ }
                    <XAxis axisAt="bottom" orient="bottom" ticks={ 7 } showTicks={ true } tickStroke={ ChartTheme.tickStroke } stroke={ ChartTheme.tickStroke } opacity={ 0.5 } />
                    {/* <XAxis axisAt="top" orient="top" showTicks={false} tickStroke={tickStroke} stroke={tickStroke} opacity={0.5}/> */ }


                    { this.renderSecurityData( chartType, ChartTheme ) }

                    { indicatorsPrepared && indicatorsPrepared.map(
                        item => <LineSeries key={ item.key } yAccessor={ item.accessor() } stroke={ item.stroke() } />
                    ) }

                    <MouseCoordinateY
                        at="right"
                        orient="right"
                        displayFormat={ format( '.2f' ) } />
                    <MouseCoordinateX
                        at="bottom"
                        orient="bottom"
                        displayFormat={ timeFormat( '%Y-%m-%d' ) } />

                    <EdgeIndicator itemType="last" orient="right" edgeAt="right"
                        yAccessor={ d => d.close } fill={ d => d.close > d.open ? ChartTheme.raiseColor : ChartTheme.fallColor } />

                    <MovingAverageTooltip
                        origin={ [ 0, 10 ] }
                        title='Click to delete'
                        textFill={ ChartTheme.tickStroke }
                        options={ [
                            {
                                yAccessor: d => d.close,
                                type: securityId,
                                stroke: ChartTheme.raiseColor,
                                windowSize: item.definition.name
                            }
                        ] }
                    />
                    { indicatorsPrepared &&
                        <MovingAverageTooltip
                            onClick={ this.handleIndicatorClick }
                            origin={ [ 200, 10 ] }
                            textFill={ ChartTheme.tickStroke }
                            options={
                                indicatorsPrepared.map( item => {
                                    return {
                                        yAccessor: item.accessor(),
                                        type: item.type(),
                                        stroke: item.stroke(),
                                        key: item.key,
                                        windowSize: item.options().windowSize
                                    };
                                }
                                )
                            }
                        /> }
                    {/* <HoverTooltip
						origin= {() => [138, 35]}
						yAccessor={d => d.close}
						tooltipContent={tooltipContent([
							{
								label: `${securityId}`,
								value: d => numberFormat(d => d.close(d)),
								stroke: 'green'
							},
						])}
						fontSize={15}
					/> */}

                </Chart>

                { this.renderVolumeChart( ChartTheme ) }

                <CrossHairCursor stroke={ ChartTheme.tickStroke } />
            </ChartCanvas>
        );
    };

    renderVolumeChart = ( chartTheme ) => {

        const height = 70;

        return (
            <Chart id={ 2 } origin={ ( w, h ) => [ 0, h - height ] } height={ height } yExtents={ d => d.volume }>
                <XAxis axisAt="bottom" orient="bottom" tickStroke={ chartTheme.tickStroke } ticks={ 7 } />
                <YAxis axisAt="right" orient="right" ticks={ 5 } tickStroke={ chartTheme.tickStroke } tickFormat={ format( '.2s' ) } opacity={ 0.5 } />

                <MouseCoordinateX
                    at="bottom"
                    orient="bottom"
                    displayFormat={ timeFormat( '%Y-%m-%d' ) } />

                <BarSeries yAccessor={ d => d.volume } fill={ ( d ) => d.close > d.open ? chartTheme.raiseColor : chartTheme.fallColor } />

            </Chart>
        );
    };

    renderSecurityData = ( chartType, chartTheme ) => {
        switch ( chartType ) {
            case CONSTANTS.CHART_TYPES.Candles:
                return (
                    <CandlestickSeries
                        stroke={ d => d.close > d.open ? chartTheme.raiseColor : chartTheme.fallColor }
                        wickStroke={ d => d.close > d.open ? chartTheme.raiseColor : chartTheme.fallColor }
                        fill={ d => d.close > d.open ? chartTheme.raiseColor : chartTheme.fallColor }
                    />
                );
            case CONSTANTS.CHART_TYPES.Area:
                return (
                    <AreaSeries
                        yAccessor={ d => d.close }
                        stroke={ chartTheme.colorAreaLine }
                        fill={ chartTheme.colorAreaFill }
                        interpolation={ curveLinear }
                    // markerProps={{ connectNulls:true, stroke: colorAreaLine, fill: colorAreaFill }}
                    />
                );
            case CONSTANTS.CHART_TYPES.Line:
                return (
                    <LineSeries
                        yAccessor={ d => d.close }
                        stroke={ chartTheme.colorAreaLine }
                        interpolation={ curveLinear }
                    //markerProps={{ connectNulls:true, stroke: colorAreaLine, fill: colorAreaFill }}
                    />
                );
            default:
                return null;
        }
    };




    renderChartControlPanel = () => {
        return (
            <div className='stockchart-control-panel'>
                <div className='stockchart-control-panel__title'>Chart:</div>
                { chartTypes.map( a => <div key={ a.id } className='stockchart-control-panel__action' onClick={ this.handleChartType } id={ a.id }>{ a.name }</div> ) }
                <div className='stockchart-control-panel__title'>Time range:</div>
                { timeRanges.map( a => <div key={ a.id } className='stockchart-control-panel__action' onClick={ this.handleChartTimeRange } id={ a.id }>{ a.name }</div> ) }
            </div>
        );
    };

    render () {
        return (
            <div className='stockchart'>
                { this.renderChartControlPanel() }
                { this.renderChart( { ...this.props, type: 'svg' } ) }
            </div>
        );
    }

}

StockHistoryChartComponent = fitWidth( StockHistoryChartComponent );


const calculateChartExtent = ( chartTimeRange, data, xAccessor ) => {
    let startDate = new Date();
    let endDate = new Date();
    switch ( chartTimeRange ) {
        case CONSTANTS.TIME_RANGES.Day:
            startDate = moment( startDate ).add( -1, 'days' );
            break;
        case CONSTANTS.TIME_RANGES.Week:
            startDate = moment( startDate ).add( -1, 'weeks' );
            break;
        case CONSTANTS.TIME_RANGES.Month2:
            startDate = moment( startDate ).add( -2, 'months' );
            break;
        case CONSTANTS.TIME_RANGES.Month3:
            startDate = moment( startDate ).add( -3, 'months' );
            break;
        case CONSTANTS.TIME_RANGES.Month6:
            startDate = moment( startDate ).add( -6, 'months' );
            break;
        case CONSTANTS.TIME_RANGES.Year:
            startDate = moment( startDate ).add( -1, 'year' );
            break;
        case CONSTANTS.TIME_RANGES.Month:
        default:
            startDate = moment( startDate ).add( -1, 'months' );
            break;
    }

    let start = xAccessor( getClosestItem( data, startDate, d => d.date ) );
    let end = xAccessor( getClosestItem( data, endDate, d => d.date ) );
    if ( start == end ) {
        start = xAccessor( last( data ) );
        end = xAccessor( data[ Math.max( 0, data.length - 7 ) ] );
    }

    return [ start, end ];
};

const prepareIndicators = ( indicators ) => {

    if ( !indicators || !indicators.length )
        return [];

    return indicators.map( ind => {
        let indObj = null;
        switch ( ind.type ) {
            case CONSTANTS.INDICATOR_TYPES.EMA:
                indObj = ema();
                break;
            case CONSTANTS.INDICATOR_TYPES.WMA:
                indObj = wma();
                break;
            case CONSTANTS.INDICATOR_TYPES.TMA:
                indObj = tma();
                break;
            case CONSTANTS.INDICATOR_TYPES.SMA:
            default:
                indObj = sma();
                break;
        }

        const key = `${ ind.type }_${ ind.window }`;

        indObj.key = key;

        return indObj.options( {
            windowSize: ind.window,
            key: key,
            sourcePath: 'close',
        } ).skipUndefined( true )
            .merge( ( d, c ) => { d[ key ] = c; } ) // Required, if not provided, log a error
            .accessor( d => d[ key ] );
    } );
};


export default StockHistoryChartComponent;


