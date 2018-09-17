import React, { PureComponent, Fragment } from 'react'

import {CandleStickStockScaleChartWithVolumeBarV3} from '../../../../components/CandleStickChart/Chart';

//TODO: customise the candles chart colors, sizes etc
export class StockHistoryChartComponent extends PureComponent {
  
    render() {

    const {candles, stockId} = this.props;

    return (
        <Fragment>             
            <div>Number of candles for stock {candles && stockId ? stockId : ''}: {candles && candles.length && candles.length}</div>
            {candles && <CandleStickStockScaleChartWithVolumeBarV3 stockId={stockId} className="dark" type='svg' data={candles} />}
        </Fragment>        
    )
  }
}
