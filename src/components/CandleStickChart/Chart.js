
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
	BarSeries,
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

export class CandleStickStockScaleChartWithVolumeBarV3 extends React.Component {
	render() {
		const { type, data: initialData, width, ratio, stockId } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 100)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={600}
				ratio={ratio}
				width={width}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				type={type}
				seriesName={stockId}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={1} height={400} yExtents={d => [d.high, d.low]} >
					<YAxis axisAt="right" orient="right" ticks={5} tickStroke="#FFFFFF"/>
					<YAxis axisAt="left" orient="left" showTicks={false} />
					<XAxis axisAt="bottom" orient="bottom" showTicks={true} tickStroke="#FFFFFF" stroke="#FFFFFF" opacity={0.5}/>
					<XAxis axisAt="top" orient="bottom" showTicks={true} tickStroke="#FFFFFF" stroke="#FFFFFF" opacity={0.5}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />
					<CandlestickSeries 
						stroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						wickStroke={d => d.close > d.open ? "#6BA583" : "#DB0000"}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>
						<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#DB0000"}/>
				</Chart>
				<Chart id={2} origin={(w, h) => [0, h - 150]} height={150} yExtents={d => d.volume}>
					<XAxis axisAt="bottom" orient="bottom" tickStroke="#FFFFFF" />
					<YAxis axisAt="left" orient="left" showTicks={false}  />
					<YAxis axisAt="right" orient="right" ticks={5} tickStroke="#FFFFFF" tickFormat={format(".2s")}/>
					<BarSeries yAccessor={d => d.volume} fill={(d) => d.close > d.open ? "#6BA583" : "#DB0000"} />
				</Chart>
				<CrossHairCursor stroke="#FFFFFF" />
			</ChartCanvas>
		);
	}
}
CandleStickStockScaleChartWithVolumeBarV3.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChartWithVolumeBarV3.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChartWithVolumeBarV3 = fitWidth(CandleStickStockScaleChartWithVolumeBarV3);

export default CandleStickStockScaleChartWithVolumeBarV3;
