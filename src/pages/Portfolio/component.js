import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

import './index.styl';

import { themeHighCharts } from './theme';
import { WarningBadgeComponent } from 'components';
import { SecurityDescriptionComponent } from 'components/SecurityDescription';
import { StockControlPanel } from 'components/StockControlPanel';


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
        startDate: selectors.getStartDate( state )
    };
}, { restorePortfolioState, storePortfolioState, addSecurityToPortfolio, deleteSecurityFromPortfolio, editPortfolioPosition, updateAll } )
class PortfolioManagementPage extends Component {

    constructor ( props ) {
        super( props );

    }

    static propTypes = {
        positions: PropTypes.array,
        startDate: PropTypes.string
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


    renderHistoryChart = ( positions ) => {

        if ( !positions || !positions.length )
            return null;

        const options = {
            title: {
                text: positions[ 0 ].securityId
            },
            xAxis: {
                type: 'datetime'
            },
            series: [],
            ...themeHighCharts,
            height: 300 // Not working!
        };

        if(!positions[ 0 ].securityItem.history){
            return null;
        }


        //TEMP!
        if(positions[ 0 ].securityItem.history){
            options.series.push({
                name: positions[ 0 ].securityId,
                data: positions[ 0 ].securityItem.history.candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            });
        }
        if(positions[ 1 ].securityItem.history){
            options.series.push({
                name: positions[ 1 ].securityId,
                data: positions[ 1 ].securityItem.history.candles.map( a => {
                    return [ a.date.getTime(), a.close ];
                } )
            });
        }

        options.rangeSelector.selected = 1;

        return (
            <div className='portfolio__history-chart'>
                <HighchartsReact
                    highcharts={ Highcharts }
                    constructorType={ 'stockChart' }
                    options={ options }               
                    chart={ {height: 200 } }     
                />
            </div>
            );
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

                    if(newPosition != positions[ cellInfo.index ].shares) {
                        this.props.editPortfolioPosition( cellInfo.index, newPosition );
                    }
                } }
                dangerouslySetInnerHTML={ {
                    __html: positions[ cellInfo.index ].shares
                } }
            />
        );
    }

    renderTable = ( positions ) => {

        const options = {
            showPagination: false,
            filterable: true,
            minRows: 5,
            noDataText: '',
            className: '-striped -highlight'
        };

        const columns = [
            {
                Header: 'Security',
                accessor: 'securityId',
                maxWidth: 200,
                Footer: (
                    <span>
                        <strong>Count:</strong>{ ' ' }
                        { positions.length }
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
                Header: 'Del.',
                accessor: 'securityId',
                filterable: false,
                Cell: row => (
                    <div className='portfolio_table_delete_column' id={ row.index } onClick={ this.handleDeleteSecurity }>&#x2715;</div>
                ),
                width: 40
            },
            {
                Header: 'Price',
                accessor: 'securityItem.price.close',
                minWidth: 100,
                maxWidth: 100
            },
            {
                Header: 'Market Value',
                accessor: 'marketValue',
                minWidth: 100,
                maxWidth: 100,
                Footer: (
                    <span>
                        <strong>Total:</strong>{ ' ' }
                        { _.round( _.sum( _.map( positions, d => d.marketValue ) ) ) }
                    </span>
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

        return (
            <div>
                <ReactTable
                    data={ positions }
                    columns={ columns }
                    { ...options }
                />
                <br />
            </div>
        );
    }

    render = () => {
        const { positions } = this.props;

        return (
            <div className='portfolio'>

                <Helmet>
                    <title>Demo portfolio management app</title>
                </Helmet>

                <StockControlPanel onUpdateAll={ this.handleUpdateAll } onAddSecurity={ this.handleAddSecurity } />

                <div className='portfolio_table'>
                    { this.renderTable( positions ) }
                </div>

                <div>
                    <Tabs>
                        <TabList>
                            <Tab>History&Comparison</Tab>
                            <Tab>Risk-Performance</Tab>
                            <Tab>Factor analysis</Tab>
                        </TabList>

                        <TabPanel>
                            { this.renderHistoryChart( positions ) }
                        </TabPanel>
                        <TabPanel>
                            <WarningBadgeComponent message={ 'Under construction.' } />
                        </TabPanel>
                        <TabPanel>
                            <WarningBadgeComponent message={ 'Under construction.' } />
                        </TabPanel>
                    </Tabs>

                </div>

            </div>
        );
    }
}


export { PortfolioManagementPage };