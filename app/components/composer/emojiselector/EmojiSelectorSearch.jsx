
import React from 'react';
import * as Redux from 'react-redux';
import { EmojiSelectionSearchText } from 'actions';

export const EmojiSelectorSearch = React.createClass({

    handleInput(evt){
        evt.preventDefault();
        const { dispatch } = this.props;
        dispatch(EmojiSelectionSearchText(evt.target.value));
    },

    handleClearText(evt){
        evt.preventDefault();
        const { dispatch } = this.props;
        dispatch(EmojiSelectionSearchText(''));
        this.emojiSearch.value = '';
        this.emojiSearch.focus();
    },

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
});

export default Redux.connect()(EmojiSelectorSearch);
