
import React from 'react';
import * as Redux from 'react-redux';
import { GiphySelectionSearchText } from 'actions';

export const GiphySelectorSearch = React.createClass({

    componentDidMount(){
        const { searchText } = this.props;
        if (searchText.length > 1){
            this.giphySearch.value = searchText;
        }
    },

    handleInput(){
        const { dispatch } = this.props;
        dispatch(GiphySelectionSearchText(this.giphySearch.value));
    },

    handleClearText(evt){
        evt.preventDefault();
        const { dispatch } = this.props;
        dispatch(GiphySelectionSearchText(''));
        this.giphySearch.value = '';
        this.giphySearch.focus();
    },

    handleKeyUp({ key }){
        if (key === 'Enter'){
            this.handleSearch();
        }
    },

    handleSearch(){
        const { onSearch } = this.props;
        onSearch();
    },

    render(){

        const { status } = this.props;

        const searchButton = () => {
            if (status === 'fetching'){
                return <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true" />;
            }
            return <i className="fa fa-search" aria-hidden="true" />;
        };

        return (
            <div className="giphy-selector-search">
                <div
                    className="giphy-selector-search-button"
                    onClick={ this.handleSearch }>
                    { searchButton() }
                </div>
                <div
                    className="giphy-selector-search-clear"
                    onClick={ this.handleClearText }>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <input
                    ref={ el => this.giphySearch = el }
                    className="giphy-selector-search-input"
                    type="text"
                    placeholder="Search"
                    onInput={ this.handleInput }
                    onKeyUp={ this.handleKeyUp } />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        status: state.giphySelector.status,
        searchText: state.giphySelector.searchText
    };
})(GiphySelectorSearch);
