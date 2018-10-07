import React, { PureComponent, Fragment } from 'react';
import Autosuggest from 'react-autosuggest';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import './index.styl';

import { searchSecurityAsync } from './actions';
import {getSecuritiesSuggestionsMap, getSecuritiesSuggestionsList } from './reducers';
//import {getReferences} from 'reducers';


@connect( ( state ) => {
    return {
        suggestions: getSecuritiesSuggestionsMap(state),
        suggestionList: getSecuritiesSuggestionsList(state),
        references: state.references //getReferences(state)
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

    static propTypes = {
        searchSecurityAsync: PropTypes.func,
        onChange: PropTypes.func,
        onAdd: PropTypes.func,
        references: PropTypes.object,
        suggestionList: PropTypes.array,
        suggestions: PropTypes.array,
        isLoading: PropTypes.bool    
    }

    static defaultProps = {
        isLoading: false,
        references: undefined,
        suggestions: new Map(),
        suggestionList: []
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

        const {references} = this.props;

        let title = section[ 0 ];

        if(references && references.securityTypes) {
            const item = references.securityTypes.find(a => a.typeName == title);
            if(item)
                title = item.typeTitle;
        }

        return (
            <div className='stock-description_item' >
                <span className='stock-description_cell_id'></span>
                <span className='stock-description_cell_title'><strong>{ title }</strong></span>
                <span className='stock-description_cell_description'></span>
            </div>
        );
    }

    render () {
        let { suggestions } = this.props;
        const { value } = this.state;
        const inputProps = {
            placeholder: 'Type \'ГАЗП\'',
            value,
            onChange: this.onChange,
            onKeyPress: this.handleKeyPress
        };

        return (
            <div className="react-autosuggest">
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

export { SecuritySelectorComponent };