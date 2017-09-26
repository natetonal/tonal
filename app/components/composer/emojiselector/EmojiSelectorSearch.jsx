
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeSearchText } from 'actions/EmojiSelectorActions';

class EmojiSelectorSearch extends Component {

    componentDidMount = () => {
        const { searchText } = this.props;
        if (searchText.length > 1){
            this.emojiSearch.value = searchText;
        }
    }

    handleInput = evt => {
        evt.preventDefault();
        const { dispatch } = this.props;
        dispatch(changeSearchText(evt.target.value));
    }

    handleClearText = evt => {
        evt.preventDefault();
        const { dispatch } = this.props;
        dispatch(changeSearchText(''));
        this.emojiSearch.value = '';
        this.emojiSearch.focus();
    }

    render(){

        return (
            <div className="emoji-selector-search">
                <div
                    className="emoji-selector-search-clear"
                    onClick={ this.handleClearText }>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <input
                    ref={ el => this.emojiSearch = el }
                    className="emoji-selector-search-input"
                    type="text"
                    placeholder="Search"
                    onInput={ this.handleInput } />
            </div>
        );
    }
}

export default connect(state => {
    return {
        searchText: state.emojiSelector.searchText
    };
})(EmojiSelectorSearch);
