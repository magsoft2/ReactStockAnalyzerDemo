
import React, {Fragment} from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";


export class StockHistoryChartComponent extends React.Component {

	renderChart = ({ type, securityItems }) => {
		const { width, ratio } = this.props;

		if(!securityItems || !securityItems.length || !securityItems[0].securityHistory)
			return null;

		const item = securityItems[0];

		if(!item.securityHistory)
			return null;

		const securityId = item.securityId;
		const initialData = item.securityHistory.candles;
		
		if(!initialData || !initialData.length)
			return null;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 100)]);
		const xExtents = [start, end];

		const tickStroke = '#78799E';
		const height = 500;
		const margin = { left: 0, right: 50, top: 10, bottom: 30 };

		return (			
			<ChartCanvas height={height}
				ratio={ratio}
				width={width}
				margin={margin}
				type={type}
				seriesName={securityId}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Label x={50} y={50} fontSize={24} text={securityId} />

				<Chart id={1} height={400} yExtents={d => [d.high, d.low]} >
					<YAxis axisAt="right" orient="right" ticks={5} tickStroke={tickStroke}/>
					<YAxis axisAt="left" orient="left" showTicks={false} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={true} tickStroke={tickStroke} stroke={tickStroke} opacity={0.5}/>
					<XAxis axisAt="top" orient="bottom" showTicks={true} tickStroke={tickStroke} stroke={tickStroke} opacity={0.5}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />

					<CandlestickSeries 
						stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>

				</Chart>
				<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
					<XAxis axisAt="bottom" orient="bottom" tickStroke={tickStroke} />
					<YAxis axisAt="left" orient="left" showTicks={false}  />
					<YAxis axisAt="right" orient="right" ticks={5} tickStroke={tickStroke} tickFormat={format(".2s")}/>

					<MouseCoordinateX
								at="bottom"
								orient="bottom"
								displayFormat={timeFormat("%Y-%m-%d")} />

					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#DB0000"} />

				</Chart>
				<CrossHairCursor stroke={tickStroke} />
			</ChartCanvas>
		);
	};

	render() {

		const { securityItems } = this.props;

		return (
			<Fragment>             
				{/* <div>Number of candles for stock {data && securityId ? securityId : ''}: {data && data.length && data.length}</div> */}
				{ this.renderChart({securityItems, type:'svg'})}
			</Fragment> 
		);
	}

}
StockHistoryChartComponent.propTypes = {
	securityItems: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

StockHistoryChartComponent.defaultProps = {
	type: "svg",
};
StockHistoryChartComponent = fitWidth(StockHistoryChartComponent);

export default StockHistoryChartComponent;
