
import React from 'react';
import * as Redux from 'react-redux';

import {
    getEmojiForCategory,
    getEmojiFromCategoryAndSearchText
} from './emojidata';

export const EmojiSelectorContainer = React.createClass({

    handleMouseEnter(title, event){
        event.preventDefault();
        const { onMouseEnter } = this.props;
        onMouseEnter(title);
    },

    handleMouseLeave(event){
        event.preventDefault();
        const { onMouseLeave } = this.props;
        onMouseLeave(event.target.value);
    },

    handleClick(name, event){
        event.preventDefault();
        const { onClick } = this.props;
        onClick(name);
    },

    renderEmoji({ path, shortname, alt }, index){

        return (
            <div
                key={ alt + index }
                className="emoji-item"
                onMouseEnter={ event => this.handleMouseEnter(shortname, event) }
                onMouseLeave={ event => this.handleMouseLeave(event) }
                onClick={ event => this.handleClick(shortname, event) }>
                <img
                    className="emoji-img"
                    src={ path }
                    alt={ alt } />
            </div>
        );
    },

    render(){

        const {
            currentTab,
            searchText,
        } = this.props;

        const currentEmoji =
            searchText ?
            getEmojiFromCategoryAndSearchText(currentTab, searchText) :
            getEmojiForCategory(currentTab);

        if (!currentEmoji){
            return (
                <div
                    className="emoji-container"
                    ref={ el => this.emojiContainer = el }>
                    <i className="fa fa-meh-o" aria-hidden="true" />
                    <span className="emoji-not-found">No matches found.</span>
                </div>
            );
        }
        return (
            <div
                className="emoji-container"
                ref={ el => this.emojiContainer = el }>
                { currentEmoji.map((emoji, index) => this.renderEmoji(emoji, index)) }
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentTab: state.emojiSelector.currentTab,
        searchText: state.emojiSelector.searchText,
        currentEmoji: state.emojiSelector.currentEmoji,
    };
})(EmojiSelectorContainer);
