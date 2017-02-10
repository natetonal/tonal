
import React from 'react';
import * as Redux from 'react-redux';
import { EmojiSelectionSearchText } from 'actions';

export const EmojiSelectorSearch = React.createClass({

    handleInput(evt){
        const { dispatch } = this.props;
        dispatch(EmojiSelectionSearchText(evt.target.value));
    },

    render(){

        return (
            <div className="emoji-selector-search">
                <input
                    className="emoji-selector-search-input"
                    type="text"
                    placeholder="Search"
                    onInput={ this.handleInput } />
            </div>
        );
    }
});

export default Redux.connect()(EmojiSelectorSearch);
