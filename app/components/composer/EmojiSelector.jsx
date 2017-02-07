
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import emojione from 'emojione/lib/js/emojione';
import { getEmojiForCategory } from './emojidata';

const tabsArray = [
    {
        name: 'people',
        title: 'Smileys & People',
        unicode: ':smile:'
    },
    {
        name: 'nature',
        title: 'Animals & Nature',
        unicode: ':dog:'
    },
    {
        name: 'food',
        title: 'Food & Drink',
        unicode: ':apple:'
    },
    {
        name: 'activity',
        title: 'Activity',
        unicode: ':basketball:'
    },
    {
        name: 'travel',
        title: 'Travel & Places',
        unicode: ':red_car:'
    },
    {
        name: 'objects',
        title: 'Objects',
        unicode: ':bulb:'
    },
    {
        name: 'symbols',
        title: 'Symbols',
        unicode: ':symbols:'
    },
    {
        name: 'flags',
        title: 'Flags',
        unicode: ':triangular_flag_on_post:'
    }
];

export const EmojiSelector = React.createClass({

    getInitialState(){
        return {
            currentTab: 'people',
            currentTitle: 'Smileys & People',
            currentSelection: 'Smileys & People',
            currentEmoji: getEmojiForCategory('people')
        };
    },

    changeTitle(event){
        event.preventDefault();
        const currentTitle = event.target.getAttribute('title');
        this.setState({ currentTitle });
    },

    clearTitle(event){
        event.preventDefault();
        this.setState({ currentTitle: this.state.currentSelection });
    },

    changeTab(event){
        event.preventDefault();
        const currentTab = event.target.getAttribute('name');
        const currentSelection = event.target.getAttribute('title');
        const currentEmoji = getEmojiForCategory(currentTab);
        this.setState({
            currentTab,
            currentSelection,
            currentEmoji
        });
    },

    testFn(event){
        event.preventDefault();
        console.log('categories: ', getEmojiForCategory('nature'));
    },

    render(){

        const { currentTab, currentTitle } = this.state;

        const tabs = () => {
            return tabsArray.map(({ name, title, unicode }) => {
                return (
                    <div
                        key={ name }
                        className={ `emoji-selector-tab ${ currentTab === name ? 'selected' : '' }` }
                        name={ name }
                        title={ title }
                        onMouseEnter={ this.changeTitle }
                        onMouseLeave={ this.clearTitle }
                        onClick={ this.changeTab }>
                        { emojione.shortnameToUnicode(unicode) }
                    </div>
                );
            });
        };

        const emoji = () => {
            const currentEmoji = getEmojiForCategory(currentTab);
            return currentEmoji.map(({ path, shortname, alt }) => {
                return (
                    <div
                        key={ alt }
                        className="emoji-item"
                        name={ shortname }
                        title={ shortname }
                        onMouseEnter={ this.changeTitle }
                        onMouseLeave={ this.clearTitle }
                        onClick={ this.selectEmoji }>
                        <img
                            className="emoji-img"
                            src={ path }
                            alt={ alt } />
                    </div>
                );
            });
        };

        return (
            <ReactCSSTransitionGroup
                transitionName="smooth-popin"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div className="emoji-selector">
                    <div className="emoji-selector-title">
                        { currentTitle }
                    </div>
                    <div className="emoji-selector-tabs">
                        { tabs() }
                    </div>
                    {/* <div
                        className="emoji-test-button"
                        onClick={ this.testFn }>
                        { emojione.shortnameToUnicode(':smile:') }
                    </div> */}
                    <div className="emoji-container">
                        { emoji() }
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
});

export default EmojiSelector;
