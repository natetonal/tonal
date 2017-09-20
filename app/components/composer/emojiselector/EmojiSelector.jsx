
import React, { Component } from 'react';
import * as Redux from 'react-redux';
import {
    changeTab,
    changeTabTitle,
    changeTitleDisplay,
} from 'actions/EmojiSelectorActions';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import EmojiSelectorTitle from './EmojiSelectorTitle';
import EmojiSelectorTabs from './EmojiSelectorTabs';
import EmojiSelectorSearch from './EmojiSelectorSearch';
import EmojiSelectorContainer from './EmojiSelectorContainer';

// how you load multiple assets using a webpack loader:
// const pathToEmoji = require.context('emojione/assets/png', true);

class EmojiSelector extends Component {

    componentWillReceiveProps(nextProps){

        const {
            searchText,
            currentTab,
            previousTab,
            previousTabTitle
        } = this.props;

        // If the user entered text and they're not on the search tab, switch them to it.
        if ((searchText.length === 0 && nextProps.searchText.length > 0) &&
            nextProps.currentTab !== 'search'){
            this.changeTab('search', 'Search');
        // If the user wiped the search text and we're on the search tab, load the previous tab.
        } else if ((searchText.length > 0 && nextProps.searchText.length === 0) &&
                    currentTab === 'search'){
            this.changeTab(previousTab, previousTabTitle);
        }
    }

    changeTitleDisplay(title){
        const { dispatch } = this.props;
        dispatch(changeTitleDisplay(title));
    }

    clearTitleDisplay(){
        const { dispatch, currentTabTitle } = this.props;
        dispatch(changeTitleDisplay(currentTabTitle));
    }

    changeTab(tab, title){
        const { dispatch } = this.props;
        dispatch(changeTab(tab));
        dispatch(changeTabTitle(title));
    }

    selectEmoji(shortname, path){
        const { handleEmoji } = this.props;
        if (shortname && path){
            handleEmoji(shortname, path);
        }
    }

    render(){

        return (
            <ReactCSSTransitionGroup
                transitionName="smooth-popin"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div className="emoji-selector">
                    <EmojiSelectorTabs
                        onMouseEnter={ this.changeTitleDisplay }
                        onMouseLeave={ this.clearTitleDisplay }
                        onClick={ this.changeTab } />
                    <EmojiSelectorSearch />
                    <EmojiSelectorContainer
                        onMouseEnter={ this.changeTitleDisplay }
                        onMouseLeave={ this.clearTitleDisplay }
                        onClick={ this.selectEmoji } />
                    <EmojiSelectorTitle />
                </div>
            </ReactCSSTransitionGroup>
        );
    }
}

export default Redux.connect(state => {
    return {
        searchText: state.emojiSelector.searchText,
        currentTab: state.emojiSelector.currentTab,
        previousTab: state.emojiSelector.previousTab,
        currentTabTitle: state.emojiSelector.currentTabTitle,
        previousTabTitle: state.emojiSelector.previousTabTitle
    };
})(EmojiSelector);
