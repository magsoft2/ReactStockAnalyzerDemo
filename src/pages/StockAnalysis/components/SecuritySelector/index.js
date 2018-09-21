import React, { PureComponent, Fragment } from "react";
import Autosuggest from 'react-autosuggest';

import "./index.styl";

import { SecurityService } from 'Services';


export class SecuritySelectorComponent extends React.Component {
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

            const suggestions = await SecurityService.findSecurity(value);

            const map = new Map();
            for(let item of suggestions){
                if(!map.has(item.type))
                    map.set(item.type, []);

                map.get(item.type).push(item)
            }

            this.setState({
                isLoading: false,
                suggestions: Array.from(map),
                suggestionList: suggestions
            });
        }, 200);
    }


    onChange = (event, { newValue, method }) => {

        if(method !== 'type' && this.props.onChange) {
            this.props.onChange(newValue);
        }

        const {suggestionList} = this.state;
        let item = undefined;

        if(suggestionList && suggestionList.length){
            item = suggestionList.filter(a => a.securityId == newValue);
            if(item.length)
                item = item[0];
        }

        this.setState({
            value: newValue,
            item, 
            selected: method !== 'type'
        });
    };

    onAdd = (event) => this.props.onAdd(this.state.value, this.state.item);

    handleKeyPress = (event) => {
        if(event.key == 'Enter' && this.state.selected){
            this.onAdd();
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



    getSuggestionValue = (suggestion) => suggestion.securityId;
    
    renderSuggestion = (item) => {
        return (
            <Fragment>
                <div className='stock-description_item' key={item.securityId}>
                                    {/* <span className='stock-description_cell_id'>{item.id}</span> */}
                                    <span className='stock-description_cell_name'>{item.securityId}</span>
                                    <span className='stock-description_cell_description'>{item.name}</span>
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
                <div className="react-autosuggest_status">
                    <a className="tooltip" href="#">?<span>Поиск инструмента по части Кода, Названию, ISIN, Идентификатору Эмитента</span></a>.
                </div>

            </div>
        );
    }
}