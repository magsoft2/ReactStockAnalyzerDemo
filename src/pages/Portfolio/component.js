import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
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
    updateAll, changeReference
} from './actions';

import {getIndexListReference} from 'root/referencesReducers';

import { globalSelectors } from './selectors';



@connect( ( state ) => {
    return {
        positions: globalSelectors.getPositions( state ),
        startDate: globalSelectors.getStartDate( state ),
        calculatedData: globalSelectors.getPortfolioCalculatedData( state ),
        referenceData: globalSelectors.getReferenceData( state ),
        indexes: getIndexListReference( state )
    };
}, { restorePortfolioState, storePortfolioState, addSecurityToPortfolio, deleteSecurityFromPortfolio, editPortfolioPosition, updateAll, changeReference } )
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
                    <div className='portfolio-table__delete-column' id={ row.index } onClick={ this.handleDeleteSecurity }>&#x2715;</div>
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
                Header: 'Vol %',
                accessor: 'calculatedData.volatility',
                minWidth: 100,
                maxWidth: 100,
                Cell: row => (
                    <div >{ _.round( row.value, 2 ) } %</div>
                ),
                Footer: (
                    <strong>
                        { _.round( calculatedData.volatility, 2 ) } %
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

    handleChangeReference = (referenceId, item) => {
        this.props.changeReference(item);
    };

    renderPositionEditor = ( cellInfo ) => {

        const positions = this.props.positions;

        return (
            <div
                className='portfolio-table__editable-cell'
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
        const { positions, calculatedData, referenceData, indexes } = this.props;

        return (
            <div className='portfolio'>

                <Helmet>
                    <title>Demo portfolio management app</title>
                </Helmet>

                <StockControlPanel onUpdateAll={ this.handleUpdateAll } onAddSecurity={ this.handleAddSecurity } />

                <div className='portfolio-table'>
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
                            <div className="portfolio-history-chart">
                                <HistoryChartComponent 
                                    calculatedData={ calculatedData } 
                                    referenceData={ referenceData } 
                                    indexes={indexes} 
                                    onChangeReference={this.handleChangeReference} />
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <RiskPerformanceChart positions={ positions } calculatedData={ calculatedData } referenceData={ referenceData } />
                        </TabPanel>
                        <TabPanel>
                            <WarningBadgeComponent message={ 'Under construction.' } />
                            <FactorsPolarChart positions={ positions } calculatedData={ calculatedData } referenceData={ referenceData } indexes={indexes}/>
                        </TabPanel>
                    </Tabs>

                </div>

            </div>
        );
    }
}


export { PortfolioManagementPage };