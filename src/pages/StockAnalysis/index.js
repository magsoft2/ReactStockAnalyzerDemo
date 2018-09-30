import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import './index.styl';

import CONFIG from 'config';

import { SecurityService, LogService, StoreService } from 'Services';

import { LoaderComponent } from 'components';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityListComponent } from './components/SecurityList';
import { IndicatorCtorComponent } from './components/IndicatorCtor';

import { CONSTANTS } from '../../constants';

import {
    restoreStockAnalysisState, storeStockAnalysisState,
    addSecurityToList, deleteSecurityFromList, checkSecurity
} from 'pages/StockAnalysis/actions';


@connect( ( state ) => {
    return {
        securities: state.securitiesAnalysis.securities,
        indicators: state.securitiesAnalysis.indicators,
        isLoading: state.securitiesAnalysis.isLoading,
        startDate: state.securitiesAnalysis.startDate
    };
}, { restoreStockAnalysisState, storeStockAnalysisState, addSecurityToList, deleteSecurityFromList, checkSecurity } )
class StockAnalysisPage extends Component {

    constructor ( props ) {
        super( props );


        this.props.restoreStockAnalysisState();

        this.state = {
            isUpdatingData: false,
        };
    }

    async componentDidMount () {

    }

    componentWillUnmount = () => {

        const { securities, indicators } = this.props;

        this.props.storeStockAnalysisState( { securities, indicators } );
    };


    
    handleUpdateAll = async () => {
        let { startDate, securities } = this.props;

        //this.setState( { isUpdatingData: true } );

        // securities = await this.loadAllData( securities, startDate, true );

        // this.setState(
        //     {
        //         securities,
        //         isUpdatingData: false
        //     } );
    };

   
    handleAddSecurity = ( id, item ) => {

        const { securities, startDate } = this.props;

        this.props.addSecurityToList( item, securities, startDate );

    };

    handleDeleteSecurity = ( id ) => {

        const { securities } = this.props;

        this.props.deleteSecurityFromList( id, securities );
    };

    handleCheckSecurity = ( id ) => {

        const { securities } = this.props;

        this.props.checkSecurity( id, securities );

    };

    handleAddIndicator = ( indicator ) => {
        const { indicators } = this.props;

        if ( indicator && indicators.findIndex( a => a.key === indicator.key ) < 0 ) {
            indicators.push( indicator );

            this.setState( { indicators } );
        }
    };
    handleDeleteIndicator = ( key ) => {
        let { indicators } = this.props;

        indicators = indicators.filter( a => a.key !== key );

        this.setState( { indicators } );
    };

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
