
import React from 'react';
import * as Redux from 'react-redux';
import { EmojiSelectionChangeEmoji } from 'actions';
import ImageLoader from 'react-imageloader';

import {
    getEmojiForCategory,
    getPathFromShortname,
    getEmojiFromSearchText
} from './emojidata';

export const EmojiSelectorContainer = React.createClass({
    //
    // componentDidMount(){
    //     const {
    //         dispatch,
    //         currentEmoji,
    //         currentTab
    //     } = this.props;
    //     if (currentEmoji.length === 0){
    //         const emoji = getEmojiForCategory(currentTab);
    //         dispatch(EmojiSelectionChangeEmoji(emoji));
    //     }
    // },
    //
    // componentWillReceiveProps(nextProps){
    //     console.log('componentWillReceipve props nextProps: ', nextProps);
    //     const {
    //         dispatch,
    //         currentTab,
    //         searchText
    //     } = this.props;
    //     if (currentTab !== nextProps.currentTab){
    //
    //         let emoji;
    //         if (searchText){
    //             emoji = getEmojiFromSearchText(searchText);
    //         } else {
    //             emoji = getEmojiForCategory(nextProps.currentTab);
    //         }
    //         dispatch(EmojiSelectionChangeEmoji(emoji));
    //     }
    // },

    shouldComponentUpdate(nextProps){
        const {
            searchText,
            currentTab
        } = this.props;
        console.log('shouldComponentUpdate nextProps: ', nextProps);
        return (currentTab !== nextProps.currentTab || searchText);
    },

    preloader(text){
        return (
            <div className="emoji-item-placeholder">
                <i className="fa fa-circle-o-notch fa-spin fa-fw emoji-placeholder" />
                { text ? <span className="emoji-placeholder-text">{ text }</span> : '' }
            </div>
        );
    },

    renderEmoji(emoji){
        const {
            onMouseEnter,
            onMouseLeave,
            onClick
        } = this.props;
        const {
            path,
            shortname,
            alt
        } = emoji;

        return (
            <ImageLoader
                key={ alt }
                src={ path }
                wrapper={ React.DOM.div }
                className="emoji-item"
                name={ shortname }
                title={ shortname }
                onMouseEnter={ () => onMouseEnter(shortname) }
                onMouseLeave={ () => onMouseLeave() }
                onClick={ () => onClick(shortname) }
                preloader={ () => this.preloader() }>
                ?
            </ImageLoader>
        );
    },

    render(){

        console.log('ESContainer render called. current props: ', this.props);
        
        const {
            currentTab,
            searchText
        } = this.props;

        const currentEmoji =
            searchText ?
            getEmojiFromSearchText(searchText) :
            getEmojiForCategory(currentTab);

        return (
            <div className="emoji-container">
                { currentEmoji.map(emoji => this.renderEmoji(emoji)) }
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentTab: state.emojiSelector.currentTab,
        searchText: state.emojiSelector.searchText,
        currentEmoji: state.emojiSelector.currentEmoji
    };
})(EmojiSelectorContainer);
