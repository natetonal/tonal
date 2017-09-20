
import React, { Component } from 'react';
import * as Redux from 'react-redux';

import {
    getPathFromShortname,
    tabsArray
} from './emojidata.js';

class EmojiSelectorTabs extends Component {

    handleMouseEnter(title, event){
        event.preventDefault();
        const { onMouseEnter } = this.props;
        onMouseEnter(title);
    }

    handleMouseLeave(event){
        event.preventDefault();
        const { onMouseLeave } = this.props;
        onMouseLeave(event.target.value);
    }

    handleClick(name, title, event){
        event.preventDefault();
        const { onClick } = this.props;
        onClick(name, title);
    }

    render(){

        const { currentTab } = this.props;

        const tabs = () => {
            return tabsArray.map(({ name, title, shortname }) => {
                const src = getPathFromShortname(shortname);
                return (
                    <div
                        key={ name }
                        className={ `emoji-selector-tab ${ currentTab === name ? 'selected' : '' }` }
                        onMouseEnter={ event => this.handleMouseEnter(title, event) }
                        onMouseLeave={ event => this.handleMouseLeave(event) }
                        onClick={ event => this.handleClick(name, title, event) }>
                        <img
                            className="emoji-tab-img"
                            src={ src }
                            alt={ shortname } />
                    </div>
                );
            });
        };

        return (
            <div className="emoji-selector-tabs">
                { tabs() }
            </div>
        );
    }
}

export default Redux.connect(state => {
    return {
        currentTab: state.emojiSelector.currentTab
    };
})(EmojiSelectorTabs);
