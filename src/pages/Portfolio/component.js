import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './index.styl';

import { WarningBadgeComponent } from 'components';
import { SecurityDescriptionComponent } from 'components/SecurityDescription';
import { StockControlPanel } from 'components/StockControlPanel';

import HistoryChartComponent from './components/HistoryChart';
import RiskPerformanceChart from './components/RiskPerformanceChart';
import FactorsPolarChart from './components/FactorsPolarChart';

import {
    restorePortfolioState, storePortfolioState,
    addSecurityToPortfolio, deleteSecurityFromPortfolio,
    editPortfolioPosition,
    updateAll
} from './actions';

import { selectors } from './reducers';



@connect( ( state ) => {
    return {
        positions: selectors.getPositions( state ),
        startDate: selectors.getStartDate( state ),
        calculatedData: selectors.getPortfolioCalculatedData( state ),
        referenceData: selectors.getReferenceData( state )
    };
}, { restorePortfolioState, storePortfolioState, addSecurityToPortfolio, deleteSecurityFromPortfolio, editPortfolioPosition, updateAll } )
class PortfolioManagementPage extends Component {

    constructor ( props ) {
        super( props );

    }

    static propTypes = {
        positions: PropTypes.array,
        startDate: PropTypes.string,
        calculatedData: PropTypes.object,
        referenceData: PropTypes.object
    }



    getTableConfig ( positions, calculatedData ) {
        const options = {
            showPagination: false,
            filterable: true,
            minRows: 5,
            noDataText: '',
            className: '-striped -highlight'
        };

        const columns = [
            {
                Header: 'Del.',
                accessor: 'securityId',
                filterable: false,
                Cell: row => (
                    <div className='portfolio_table_delete_column' id={ row.index } onClick={ this.handleDeleteSecurity }>&#x2715;</div>
                ),
                width: 40
            },
            {
                Header: 'Security',
                accessor: 'securityId',
                maxWidth: 150,
                Footer: (
                    <span>
                        <strong>Total:{ ' ' }
                            { positions.length }
                        </strong>
                    </span>
                )
            },
            {
                Header: 'Shares',
                accessor: 'shares',
                Cell: this.renderPositionEditor,
                minWidth: 100,
                maxWidth: 100
            },
            {
                Header: 'Mav %',
                accessor: 'calculatedData.positionProc',
                minWidth: 70,
                maxWidth: 70,
                Cell: row => (
                    <div >{ _.round( row.value, 2 ) } %</div>
                ),
            },
            {
                Header: 'Price',
                accessor: 'securityItem.price.close',
                minWidth: 100,
                maxWidth: 100
            },
            {
                Header: 'Market Value',
                accessor: 'calculatedData.marketValue',
                minWidth: 100,
                maxWidth: 100,
                Cell: row => (
                    <div >{ _.round( row.value ) }</div>
                ),
                Footer: (
                    <strong>
                        { _.round( calculatedData.marketValue ) }
                    </strong>
                )
            },
            {
                Header: 'Perf %',
                accessor: 'calculatedData.performance',
                minWidth: 100,
                maxWidth: 100,
                Cell: row => (
                    <div >{ _.round( row.value, 2 ) } %</div>
                ),
                Footer: (
                    <strong>
                        { _.round( calculatedData.performance, 2 ) } %
                    </strong>
                )
            },
            {
                Header: 'Vol',
                accessor: 'calculatedData.volatility',
                minWidth: 100,
                maxWidth: 100,
                Cell: row => (
                    <div >{ _.round( row.value ) }</div>
                ),
                Footer: (
                    <strong>
                        { _.round( calculatedData.volatility, 2 ) }
                    </strong>
                )
            },
            {
                Header: 'Description',
                accessor: 'securityItem',
                Cell: row => (
                    <SecurityDescriptionComponent securityItem={ row.value } />
                )
            }
        ];

        return { options, columns };
    }

    componentDidMount () {
        this.props.restorePortfolioState();
    }

    componentWillUnmount = () => {

        this.props.storePortfolioState();
    };



    handleAddSecurity = ( id, item ) => this.props.addSecurityToPortfolio( item );
    //todo: recalculate portfolio saga

    handleDeleteSecurity = ( e ) => {
        this.props.deleteSecurityFromPortfolio( e.target.id );
        this.props.storePortfolioState();
    }

    handleUpdateAll = () => {
        const { startDate, positions } = this.props;

        this.props.updateAll( positions.map( a => a.securityItem ), startDate );
    };



    renderPositionEditor = ( cellInfo ) => {

        const positions = this.props.positions;

        return (
            <div
                className='portfolio_table_editable-cell'
                contentEditable
                suppressContentEditableWarning
                onBlur={ e => {

                    const newPosition = e.target.innerHTML;
                    //TODO: add validation

                    if ( newPosition != positions[ cellInfo.index ].shares ) {
                        this.props.editPortfolioPosition( cellInfo.index, newPosition );
                    }
                } }
                dangerouslySetInnerHTML={ {
                    __html: positions[ cellInfo.index ].shares
                } }
            />
        );
    }

    renderTable = ( positions, calculatedData ) => {

        const tableConfig = this.getTableConfig( positions, calculatedData );

        return (
            <div>
                <ReactTable
                    data={ positions }
                    columns={ tableConfig.columns }
                    { ...tableConfig.options }
                />
                <br />
            </div>
        );
    }

    render = () => {
        const { positions, calculatedData, referenceData } = this.props;

        return (
            <div className='portfolio'>

                <Helmet>
                    <title>Demo portfolio management app</title>
                </Helmet>

                <StockControlPanel onUpdateAll={ this.handleUpdateAll } onAddSecurity={ this.handleAddSecurity } />

                <div className='portfolio_table'>
                    { this.renderTable( positions, calculatedData ) }
                </div>

                <div>
                    <Tabs>
                        <TabList>
                            <Tab>History&Comparison</Tab>
                            <Tab>Risk-Performance</Tab>
                            <Tab>Factor analysis</Tab>
                        </TabList>

                        <TabPanel>
                            <div className="portfolio__history-chart">
                                <HistoryChartComponent calculatedData={ calculatedData } referenceData={ referenceData } />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <WarningBadgeComponent message={ 'Under construction.' } />
                            <RiskPerformanceChart positions={ positions } calculatedData={ calculatedData } referenceData={ referenceData } />
                        </TabPanel>
                        <TabPanel>
                            <WarningBadgeComponent message={ 'Under construction.' } />
                            <FactorsPolarChart positions={ positions } calculatedData={ calculatedData } referenceData={ referenceData } />
                        </TabPanel>
                    </Tabs>

                </div>

            </div>
        );
    }
}


export { PortfolioManagementPage };