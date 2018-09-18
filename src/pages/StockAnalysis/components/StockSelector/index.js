import React, { PureComponent, Fragment } from "react";
import Autosuggest from 'react-autosuggest';

import "./index.styl";

import { MoexProvider } from 'Services';

const IDX_TYPE = 12;

export class InputAutoSuggestion extends React.Component {
    constructor() {
        super();

        this.state = {
            value: '',
            suggestions: [],
            isLoading: false,
            selected: false
        };

        this.lastRequestId = null;
    }

    loadSuggestions(value) {
        // Cancel the previous request
        if (this.lastRequestId !== null) {
            clearTimeout(this.lastRequestId);
        }

        this.setState({
            isLoading: true
        });

        this.lastRequestId = setTimeout(async () => {

            const suggestions = await this.findStockByName(value);

            const map = new Map();
            for(let item of suggestions){
                if(!map.has(item[IDX_TYPE]))
                    map.set(item[IDX_TYPE], []);

                map.get(item[IDX_TYPE]).push(item)
            }

            this.setState({
                isLoading: false,
                suggestions: Array.from(map)
            });
        }, 200);
    }


    findStockByName = async (stockNamePart) => {
        const res = await MoexProvider.findStock(stockNamePart);

        if (res.data && res.data.securities) {
            res.data.securities.data = res.data.securities.data.filter((value, index, self) => self.findIndex(el => el[0] === value[0]) === index);

            return res.data.securities.data;
        }

        return [];
    };

    onChange = (event, { newValue, method }) => {

        if(method !== 'type') {
            this.props.onChange(newValue);
        }
        console.log('method: '+method);

        this.setState({
            value: newValue,
            selected: method !== 'type'
        });
    };

    onAdd = (event) => this.props.onAdd(this.state.value);

    handleKeyPress = (event) => {
        if(event.key == 'Enter' && this.state.selected){
            console.log('enter');
            this.props.onAdd(this.state.value);
        }

        this.setState({selected: false});
    }


    onSuggestionsFetchRequested = ({ value }) => {
        this.loadSuggestions(value);
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };



    getSuggestionValue = (suggestion) => suggestion[1];
    
    renderSuggestion = (item) => {
        return (
            <Fragment>
                {/* <span>{item[1]}</span><span>{item[2]}</span> */}
                <div className='stock-description_item' key={item[1]}>
                                    <span className='stock-description_cell_id'>{item[0]}</span>
                                    <span className='stock-description_cell_name'>{item[1]}</span>
                                    <span className='stock-description_cell_description'>{item[4]}</span>
                </div>
            </Fragment>
        );
    }

    renderSectionTitle = (section) => {
        return (
            <div className='stock-description_item' >
                <span className='stock-description_cell_id'></span>
                <span className='stock-description_cell_name'><strong>{section[0]}</strong></span>
                <span className='stock-description_cell_description'></span>
            </div>
        );
      }

    getSectionSuggestions = (section) => {
       return section[1];
    }

    render() {
        const { value, suggestions, isLoading } = this.state;
        const inputProps = {
            placeholder: "Type 'ГАЗП'",
            value,
            onChange: this.onChange,
            onKeyPress: this.handleKeyPress
        };
        const status = (isLoading ? '...' : '');

        return (
            <div className="react-autosuggest">
                <Autosuggest
                    suggestions={suggestions}
                    multiSection={true}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    renderSectionTitle={this.renderSectionTitle}
                    getSectionSuggestions={this.getSectionSuggestions}
                    inputProps={inputProps} />
                <div className="react-autosuggest_add_btn" onClick={this.onAdd}>
                    +
                </div>
                <div className="react-autosuggest_status">
                    {status}
                </div>

            </div>
        );
    }
}