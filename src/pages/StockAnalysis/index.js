import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import {Helmet} from 'react-helmet';
import moment from 'moment';

import './index.styl';

import {incrementAsync} from 'actions';

import CONFIG from 'config';

import { SecurityService, LogService, StoreService } from 'Services';

import { StockHistoryChartComponent } from '../../components/StockHistoryChart';
import { SecuritySelectorComponent } from './components/SecuritySelector';
import { SecurityListComponent } from './components/SecurityList';
import { IndicatorCtorComponent } from './components/IndicatorCtor';

import { CONSTANTS } from '../../constants';



@connect((state) => {
    return {
        notifications: state.notifications
    };
}, { incrementAsync })
class StockAnalysisPage extends Component {

    constructor(props) {
        super(props);
        

        let {securityItems = undefined, indicators = [] } = StoreService.restoreStockAnalysisState();

        if(!securityItems){
            LogService.log('StockAnalysis: initialize project state');

            const definition = { 
                securityId: 'GAZP', 
                name: 'GAZP',
                group: 'stock_shares'
            };
            
            securityItems = [
                {
                    securityId: definition.securityId,
                    selected: true,
                    definition,
                    history: undefined,
                    description: undefined
                }];
        }else{
            LogService.log('StockAnalysis: project state was restored');
        }

        this.state = {
            isUpdatingData: false,
            indicators,
            startDate: moment().add(-1, 'years').format(CONSTANTS.dateFormat),
            securityItems
        };

        //this.findStockByName = debounce(this.findStockByName, 200);
    }

    async componentDidMount() {

        let { securityItems, startDate } = this.state;

        this.setState({ isUpdatingData: true });

        securityItems = await this.loadAllData(securityItems, startDate, false);

        this.setState({ securityItems, isUpdatingData: false });

        this.props.incrementAsync('Hello');

    }

    componentWillUnmount = () => {

        const { securityItems, indicators } = this.state;

        StoreService.storeStockAnalysisState({ securityItems, indicators } );
    };



    getSecurityHistory = async (securityId, securityGroup, startDate) => {

    	const resHist = await SecurityService.getSecurityHistory(securityId, securityGroup, startDate);

    	return {
    		securityId: securityId,
    		candles: resHist
    	};
    };

    findItemByIdInList = (id, list) => {
        
    	if(list && list.length){
    		let item = list.filter(a => a.securityId == id);
    		if(item && item.length){
    			return item[0];
    		}
    	}
        
    	return undefined;
    };

    loadAllData = async (securityItems, startDate, forceUpdate = false) => {
        if(!securityItems || !securityItems.length)
            return securityItems;

        for(const item of securityItems) {

            const description = item.description && !forceUpdate ? item.description : await SecurityService.getSecurityDescription(item.securityId);
            const history = item.history && !forceUpdate ? item.history : await this.getSecurityHistory(item.securityId, item.definition.group, startDate);
            //TEMP! optimize it. 

            this.updateOrAddItemToList(securityItems, item.definition, history, description);
        }

        return securityItems;
    };


    handleUpdateAll = async () => {
    	let { startDate, securityItems } = this.state;

        this.setState({ isUpdatingData: true });

        securityItems = await this.loadAllData(securityItems, startDate, true);

    	this.setState(
    		{ 
                securityItems,
                isUpdatingData: false
    		});
    };

    updateOrAddItemToList = (list, itemNew, history, description) => {

    	if(!itemNew)
    		return list;

    	let item = this.findItemByIdInList(itemNew.securityId, list);
    	if(!item){
    		item = {
    			securityId: itemNew.securityId
    		};
    		list.unshift(item);
    	}
    	item.definition = itemNew;
    	item.history = history ? history : item.history;
    	item.description = description ? description : item.description;

    	return list;
    };

    handleAddSecurity = async(newSecurityId, item) => {

    	const {securityItems, indicators, startDate} = this.state;

    	if(securityItems && securityItems.length > 20)
    		return;

        this.setState({ isUpdatingData: true });

    	let list = this.updateOrAddItemToList(securityItems, item);

    	let itemTemp = this.findItemByIdInList(item.securityId, list);
    	if(itemTemp){
    		itemTemp.selected = true;
            list.map(a => a.securityId != item.securityId ? a.selected = false : '');
    	}
        
    	this.setState({
    		securityItems: list
    	});

    	const description = await SecurityService.getSecurityDescription(item.securityId);
    	const history = await this.getSecurityHistory(item.securityId, item.group, startDate);

    	list = this.updateOrAddItemToList(list, item, history, description);

        StoreService.storeStockAnalysisState({ list, indicators } );

    	this.setState({
            securityItems: list,
            isUpdatingData: false
    	});

    };
    handleDeleteSecurity = (id) => {
    	const {securityItems, indicators} = this.state;

    	if(securityItems && securityItems.length > 1){
            const newList = securityItems.filter(a => a.securityId !== id);
            
            StoreService.storeStockAnalysisState({ newList, indicators } );

    		this.setState({securityItems: newList});
    	}
    };    
    handleCheckSecurity = (id) => {
        
    	const {securityItems} = this.state;

    	const item = this.findItemByIdInList(id, securityItems);

    	if(item){
    		item.selected = !item.selected;
    		securityItems.map(a => a.securityId != item.securityId ? a.selected = false : '');
    		this.setState({securityItems});
    	}
    };

    handleAddIndicator = (indicator) =>{
        const {indicators} = this.state;

        if(indicator && indicators.findIndex(a => a.key === indicator.key) < 0) {
            indicators.push(indicator);

            this.setState({indicators});
        }
    };
    handleDeleteIndicator = (key) => {
        let {indicators} = this.state;

        indicators = indicators.filter(a => a.key !== key);

        this.setState({indicators});
    };
    
    render = () => {
    	const { securityItems, isUpdatingData, indicators } = this.state;

        LogService.log('render: '+this.props.notifications.length, this.props.notifications);


        return (
    		<div className='dark stock-analysis'>

    			<Helmet>
    				<title>Demo stock analysis app</title>
    			</Helmet>

                <div className='stock-analysis__control_panel'>
        			<SecuritySelectorComponent onAdd={this.handleAddSecurity}/>
  				    <div className='btn' onClick={this.handleUpdateAll} title='Обновить все данные'> { isUpdatingData ? <div className='lds-dual-ring'></div> : <span>&#x27F3;</span> } Update all data</div>
                    <IndicatorCtorComponent onAdd={this.handleAddIndicator} />
                </div>
                
    			<SecurityListComponent securityItems={securityItems} onDelete={this.handleDeleteSecurity} onCheck={this.handleCheckSecurity} />

                <div className='stock-analysis_chart_container'>
                    { securityItems && securityItems.length && 
                    <StockHistoryChartComponent 
                        securityItem={securityItems.filter( a => a.selected ).pop()}
                        indicators={indicators} 
                        onIndicatorClick={this.handleDeleteIndicator}/> }
                </div>

    		</div>
    	);
    }
}

export {StockAnalysisPage};
