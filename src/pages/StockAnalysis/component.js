import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import './index.styl';

import CONFIG from 'config';

import { LogService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecurityListComponent } from './components/SecurityList';
import { IndicatorCtorComponent } from './components/IndicatorCtor';
import { StockControlPanel} from 'components/StockControlPanel';

import { CONSTANTS } from '../../constants';

import {
    restoreStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, deleteSecurityFromList, checkSecurity,
    addIndicator, deleteIndicator,
    updateAll
} from './actions';

import {selectors} from './reducers';



@connect( ( state ) => {
    return {
        securities: selectors.getSecuritiesSelected(state),
        indicators: selectors.getIndicatorsSelected(state),
        startDate: selectors.getStartDate(state)
    };
}, { restoreStockAnalysisState, storeStockAnalysisState, addSecurityToList, deleteSecurityFromList, checkSecurity, addIndicator, deleteIndicator, updateAll } )
class StockAnalysisPage extends PureComponent {

    constructor ( props ) {
        super( props );

    }

    static propTypes = {
        securities: PropTypes.array,
        indicators: PropTypes.array,
        startDate: PropTypes.string
    }

    componentDidMount () {
        this.props.restoreStockAnalysisState();
    }

    componentWillUnmount = () => {

        this.props.storeStockAnalysisState( );
    };


    
    handleUpdateAll = () => {
        const { startDate, securities } = this.props;

        this.props.updateAll(securities, startDate);
    };

   
    handleAddSecurity = ( id, item ) => {

        const { securities, startDate } = this.props;

        const maxSecuritiesNum = 20;
        if ( securities && securities.length > maxSecuritiesNum ) {
            LogService.error( `cannot add more than ${maxSecuritiesNum} securities to list` );
            return;
        }

        this.props.addSecurityToList( item, startDate );

    };

    handleDeleteSecurity = ( id ) => {
        this.props.deleteSecurityFromList( id );
        this.props.storeStockAnalysisState();
    };

    handleCheckSecurity = ( id ) => this.props.checkSecurity( id );

    handleAddIndicator = ( indicator ) => this.props.addIndicator( indicator );

    handleDeleteIndicator = ( key ) => this.props.deleteIndicator( key );


    render = () => {
        const { securities, indicators } = this.props;

        return (
            <div className='dark stock-analysis'>

                <Helmet>
                    <title>Demo stock analysis app</title>
                </Helmet>

                <StockControlPanel onUpdateAll={ this.handleUpdateAll } onAddSecurity={ this.handleAddSecurity } >
                    <IndicatorCtorComponent onAdd={ this.handleAddIndicator } />
                </StockControlPanel>

                <SecurityListComponent securityItems={ securities } onDelete={ this.handleDeleteSecurity } onCheck={ this.handleCheckSecurity } />

                <div className='stock-analysis__chart-container'>
                    { securities && securities.length &&
                        <StockHistoryChartComponent
                            securityItem={ securities.filter( a => a.selected ).pop() }
                            indicators={ indicators }
                            onIndicatorClick={ this.handleDeleteIndicator } /> }
                </div>

            </div>
        );
    }
}

export { StockAnalysisPage };
