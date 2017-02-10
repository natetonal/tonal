
import React from 'react';
import * as Redux from 'react-redux';
import {
    EmojiSelectionChangeTab,
    EmojiSelectionChangeTabTitle,
    EmojiSelectionChangeTitleDisplay,
} from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import EmojiSelectorTitle from './EmojiSelectorTitle';
import EmojiSelectorTabs from './EmojiSelectorTabs';
import EmojiSelectorSearch from './EmojiSelectorSearch';
import EmojiSelectorContainer from './EmojiSelectorContainer';

// how you load multiple assets using a webpack loader:
// const pathToEmoji = require.context('emojione/assets/png', true);

export const EmojiSelector = React.createClass({

    changeTitleDisplay(title){
        const { dispatch } = this.props;
        dispatch(EmojiSelectionChangeTitleDisplay(title));
    },

    clearTitleDisplay(){
        const { dispatch, currentTabTitle } = this.props;
        dispatch(EmojiSelectionChangeTitleDisplay(currentTabTitle));
    },

    changeTab(tab, title){
        const { dispatch } = this.props;
        dispatch(EmojiSelectionChangeTab(tab));
        dispatch(EmojiSelectionChangeTabTitle(title));
    },

    selectEmoji(event){
        const currentTitle = event.target.getAttribute('title');
        console.log('Emoji selected: ', currentTitle);
    },

    render(){

        return (
            <ReactCSSTransitionGroup
                transitionName="smooth-popin"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div className="emoji-selector">
                    <EmojiSelectorTitle />
                    <EmojiSelectorTabs
                        onMouseEnter={ this.changeTitleDisplay }
                        onMouseLeave={ this.clearTitleDisplay }
                        onClick={ this.changeTab } />
                    <EmojiSelectorSearch />
                    <EmojiSelectorContainer
                        onMouseEnter={ this.changeTitleDisplay }
                        onMouseLeave={ this.clearTitleDisplay }
                        onClick={ this.selectEmoji } />
                </div>
            </ReactCSSTransitionGroup>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentTabTitle: state.emojiSelector.currentTabTitle
    };
})(EmojiSelector);
