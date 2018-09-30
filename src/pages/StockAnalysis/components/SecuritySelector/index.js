import React, { PureComponent, Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import './index.styl';

import { searchSecurityAsync } from './actions';
import {LoaderComponent, Header} from 'components';

@connect( ( state ) => {
    return {
        suggestions: state.suggestions.securitiesSuggestionsMap,
        suggestionList: state.suggestions.securitiesSuggestionsList,
        isLoading: state.suggestions.isLoading
    };
}, { searchSecurityAsync } )
class SecuritySelectorComponent extends React.PureComponent {
    constructor () {
        super();

        this.state = {
            value: '',
            item: undefined,
            selected: false
        };

        this.lastRequestId = null;
    }

    loadSuggestions ( value ) {

        this.props.searchSecurityAsync(value);
    }


    onChange = ( event, { newValue, method } ) => {

        if ( method !== 'type' && this.props.onChange ) {
            this.props.onChange( newValue );
        }

        const { suggestionList } = this.props;
        let item = undefined;

        if ( suggestionList && suggestionList.length ) {
            item = suggestionList.filter( a => a.securityId == newValue );
            if ( item.length )
                item = item[ 0 ];
        }

        this.setState( {
            value: newValue,
            item,
            selected: method !== 'type'
        } );
    };

    onAdd = ( event ) => this.props.onAdd( this.state.value, this.state.item );

    handleKeyPress = ( event ) => {
        if ( event.key == 'Enter' && this.state.selected ) {
            this.onAdd();
        }

        this.setState( { selected: false } );
    }


    onSuggestionsFetchRequested = ( { value } ) => {
        this.loadSuggestions( value );
    };

    onSuggestionsClearRequested = () => {
        // this.setState( {
        //     suggestions: []
        // } );
    };



    getSuggestionValue = ( suggestion ) => suggestion.securityId;

    getSectionSuggestions = ( section ) => {
        return section[ 1 ];
    }


    renderSuggestion = ( item ) => {
        return (
            <Fragment>
                <div className='stock-description_item' key={ item.securityId }>
                    {/* <span className='stock-description_cell_id'>{item.id}</span> */ }
                    <span className='stock-description_cell_name'>{ item.securityId }</span>
                    <span className='stock-description_cell_description'>{ item.name }</span>
                </div>
            </Fragment>
        );
    }

    renderSectionTitle = ( section ) => {
        return (
            <div className='stock-description_item' >
                <span className='stock-description_cell_id'></span>
                <span className='stock-description_cell_name'><strong>{ section[ 0 ] }</strong></span>
                <span className='stock-description_cell_description'></span>
            </div>
        );
    }

    render () {
        let { suggestions, isLoading } = this.props;
        const { value } = this.state;
        const inputProps = {
            placeholder: 'Type \'ГАЗП\'',
            value,
            onChange: this.onChange,
            onKeyPress: this.handleKeyPress
        };

        return (
            <div className="react-autosuggest">
                <LoaderComponent show={isLoading} />
                <Autosuggest
                    suggestions={ suggestions }
                    multiSection={ true }
                    onSuggestionsFetchRequested={ this.onSuggestionsFetchRequested }
                    onSuggestionsClearRequested={ this.onSuggestionsClearRequested }
                    getSuggestionValue={ this.getSuggestionValue }
                    renderSuggestion={ this.renderSuggestion }
                    renderSectionTitle={ this.renderSectionTitle }
                    getSectionSuggestions={ this.getSectionSuggestions }
                    inputProps={ inputProps } />

                <div className="react-autosuggest_add_btn" onClick={ this.onAdd }>
                    +
    			</div>
                <div className="react-autosuggest__status">
                    <a className="tooltip" href="#">?<span>Поиск инструмента по части Кода, Названию, ISIN, Идентификатору Эмитента</span></a>
    			</div>

            </div>
        );
    }
}

SecuritySelectorComponent.propTypes = {
    onAdd: PropTypes.func,
    onChange: PropTypes.func,
    suggestionList: PropTypes.array,
    suggestions: PropTypes.object,
    isLoading: PropTypes.bool
};

export { SecuritySelectorComponent };