import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import './index.styl';

import CONFIG from 'config';

import { LogService } from 'Services';

import { LoaderComponent } from 'components';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityListComponent } from './components/SecurityList';
import { IndicatorCtorComponent } from './components/IndicatorCtor';

import { CONSTANTS } from '../../constants';

import {
    restoreStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, deleteSecurityFromList, checkSecurity,
    addIndicator, deleteIndicator,
    updateAll
} from 'pages/StockAnalysis/actions';

import {selectors} from './reducers';


@connect( ( state ) => {
    return {
        securities: selectors.getSecuritiesSelected(state),
        indicators: selectors.getIndicatorsSelected(state),
        isLoading: selectors.getIsLoading(state),
        startDate: selectors.getStartDate(state)
    };
}, { restoreStockAnalysisState, storeStockAnalysisState, addSecurityToList, deleteSecurityFromList, checkSecurity, addIndicator, deleteIndicator, updateAll } )
class StockAnalysisPage extends Component {

    constructor ( props ) {
        super( props );

    }

    componentDidMount () {
        this.props.restoreStockAnalysisState();
    }

    componentWillUnmount = () => {

        this.props.storeStockAnalysisState( );
    };


    
    handleUpdateAll = async () => {
        let { startDate, securities } = this.props;

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
        const { securities, isLoading, indicators } = this.props;

        return (
            <div className='dark stock-analysis'>

                <Helmet>
                    <title>Demo stock analysis app</title>
                </Helmet>

                <LoaderComponent show={ isLoading } />

                <div className='stock-analysis__control_panel'>
                    <SecuritySelectorComponent onAdd={ this.handleAddSecurity } />
                    <IndicatorCtorComponent onAdd={ this.handleAddIndicator } />
                    <div className='btn stock-analysis__control_panel__separator' onClick={ this.handleUpdateAll } title='Обновить все данные'> <span>&#x27F3;</span> Update all data</div>
                </div>

                <SecurityListComponent securityItems={ securities } onDelete={ this.handleDeleteSecurity } onCheck={ this.handleCheckSecurity } />

                <div className='stock-analysis_chart_container'>
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
