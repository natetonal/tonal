
import React from 'react';
import * as Redux from 'react-redux';
import { Preload } from 'react-preload';

import {
    getEmoji,
    onlyPaths
} from './emojidata';

import EmojiSelectorSkinToneModifier from './EmojiSelectorSkinToneModifier';

export const EmojiSelectorContainer = React.createClass({

    preloader(text){
        return (
            <div className="emoji-container">
                <div className="emoji-item-placeholder">
                    <i className="fa fa-circle-o-notch fa-spin fa-fw emoji-placeholder" />
                    { text ? <span className="emoji-placeholder-text">{ text }</span> : '' }
                </div>
            </div>
        );
    },

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

    handleClick(shortname, path, event){
        event.preventDefault();
        const { onClick } = this.props;
        onClick(shortname, path);
    },

    renderEmoji({ path, shortname, alt }, index){

        return (
            <div
                key={ alt + index }
                className="emoji-item"
                onMouseEnter={ event => this.handleMouseEnter(shortname, event) }
                onMouseLeave={ event => this.handleMouseLeave(event) }
                onClick={ event => this.handleClick(shortname, path, event) }>
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
            skinToneModifier
        } = this.props;

        const currentEmoji = getEmoji(currentTab, searchText, skinToneModifier);
        const emojiURL = onlyPaths(currentEmoji);

        const skinToneModifierModule = () => {
            if (currentTab === 'people' || currentTab === 'activity'){
                return (
                    <EmojiSelectorSkinToneModifier
                        onMouseEnter={ this.props.onMouseEnter }
                        onMouseLeave={ this.props.onMouseLeave } />
                );
            }
        };

        if (!currentEmoji || currentEmoji.length === 0){
            return (
                <div
                    className="emoji-container"
                    ref={ el => this.emojiContainer = el }>
                    { skinToneModifierModule() }
                    <i className="fa fa-meh-o" aria-hidden="true" />
                    <span className="emoji-not-found">No matches found.</span>
                </div>
            );
        }

        return (

            <Preload
                loadingIndicator={ this.preloader('Reticulating Splines...') }
                images={ emojiURL }
                autoResolveDelay={ 3000 }
                mountChildren
                resolveOnError>
                <div
                    className="emoji-container"
                    ref={ el => this.emojiContainer = el }>
                    { skinToneModifierModule() }
                    { currentEmoji.map((emoji, index) => this.renderEmoji(emoji, index)) }
                </div>
            </Preload>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentTab: state.emojiSelector.currentTab,
        searchText: state.emojiSelector.searchText,
        skinToneModifier: state.emojiSelector.skinToneModifier,
        currentEmoji: state.emojiSelector.currentEmoji
    };
})(EmojiSelectorContainer);
