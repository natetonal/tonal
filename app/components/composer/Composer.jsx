
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import urlRegex from 'superhuman-url-regex';

import Medium from './medium';
import EmojiSelector from './emojiselector/EmojiSelector';
import StickerSelector from './stickerselector/StickerSelector';

import { composerChangeMenu } from 'actions';

// You can add new entity types here.
const entityTypes = [
    {
        name: 'link',
        regex: urlRegex({ liberal: true }),
        className: 'composer-link',
        tag: 'span'
    },
    {
        name: 'mention',
        regex: /(^|\B)@\b([-a-zA-Z0-9._]{3,25})\b/ig,
        className: 'composer-mention',
        tag: 'span'
    },
    {
        name: 'hashtag',
        regex: /(^|\B)#\b([-a-zA-Z0-9._]{1,30})(\b|\r)/ig,
        className: 'composer-hashtag',
        tag: 'span'
    }
];

// You can add new buttons here.
const controlBtns = [
    {
        name: 'emoji',
        icon: 'fa fa-smile-o'
    },
    {
        name: 'stickers',
        icon: 'icon-unicorn'
    }
];

// You can add new URLs for the decorator to ignore here.
const regexIgnoreList = [
    'https://cdn.jsdelivr.net/emojione/assets/png/'
];

// This dumps styling tags.
const stripHTML = /<\/?(span|font|p)[^>]*>/gi;

export const Composer = React.createClass({

    getInitialState(){
        return {
            focused: false,
            showEmojiSelector: false,
            showStickerSelector: false,
            pos: ''
        };
    },

    componentDidMount(){
        this.mediumSettings = {
            element: this.composer,
            mode: Medium.richMode,
            tags: null,
            autofocus: true,
            attributes: null
        };
        this.resetMedium();
        this.composer.focus();
    },

    resetMedium(){
        this.medium = new Medium(this.mediumSettings);
    },

    handleMention(evt, element){
        console.log('handleMention evoked: ', element);
    },

    handleFocus(){
        this.setState({ focused: true });
    },

    handleBlur(){
        this.setState({ focused: false });
    },

    handleKeyUp({ key, target: { textContent } }){
        if (key !== 'Enter'){
            if (textContent.length === 0){
                this.resetMedium();
                this.medium.value('');
            // } else if (textContent.length === 1){
            //     const pos = select(this.composer).end;
            //     this.medium.value(textContent);
            //     select(this.composer, { start: pos });
            } else {
                const newVal = this.decorateEntities();
                const pos = select(this.composer);
                console.log('newVal for medium: ', newVal);
                this.medium.value(`${ newVal }`);
                select(this.composer, pos);
            }
        }
    },

    handleInsertEmoji(shortname, path){
        const { pos } = this.state;
        this.setState({ showEmojiSelector: !this.state.showEmojiSelector });
        this.medium.focus();
        if (pos && !pos.atStart) {
            select(this.composer, pos);
        }
        this.medium.insertHtml(`<img class="composer-emoji" src=${ path } alt=${ shortname } />&nbsp;`);
        console.log('pos after: ', select(this.composer));
    },

    // refactor this shit.
    handleControl(name, evt){
        evt.preventDefault();
        const { dispatch } = this.props;
        console.log('button pressed: ', name);
        dispatch(composerChangeMenu(name));
    },

    buildTag(tag, word, className){
        return `<${ tag } class="${ className }">${ word }</${ tag }>`;
    },

    stripPrevTags(){
        const value = this.medium.value();
        let newVal = value;
        let checkArray = [];
        while ((checkArray = stripHTML.exec(value)) !== null){
            const thisTag = new RegExp(checkArray[0], 'gi');
            newVal = newVal.replace(thisTag, '');
        }

        return newVal;
    },

    shouldIgnoreWord(word){
        // Innocent until proven guilty
        let shouldIgnore = false;
        regexIgnoreList.forEach(blacklistItem => {
            const re = new RegExp(blacklistItem, 'gi');
            if (word.match(re)){
                console.log('this word is on the blacklist.');
                shouldIgnore = true;
            }
        });

        return shouldIgnore;
    },

    decorateEntities(){
        const value = this.stripPrevTags();
        let decoratedText = value;
        entityTypes.forEach(entity => {
            const { regex, className, tag } = entity;
            if (decoratedText.match(regex)){
                let checkArray;
                while ((checkArray = regex.exec(value)) !== null){
                    const word = checkArray[0];
                    console.log('word: ', word);
                    if (!this.shouldIgnoreWord(word)){
                        console.log('the ignore list doesnt include this word.');
                        const re = new RegExp(word, 'gi');
                        const newStr = this.buildTag(tag, word, className);
                        decoratedText = decoratedText.replace(re, newStr);
                    }
                }
            }
        });

        console.log('decoratedText: ', decoratedText);

        return decoratedText;
    },

    submitPost(){
        event.preventDefault();
        console.log('Formatted post for submission: ?');
    },

    render(){

        const { focused } = this.state;
        const { currentMenu } = this.props;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        const btns = () => {
            return controlBtns.map(btn => {
                return (
                    <div
                        key={ btn.name }
                        className="composer-control"
                        onMouseDown={ evt => this.handleControl(btn.name, evt) }>
                        <i
                            className={ btn.icon }
                            aria-hidden="true" />
                    </div>
                );
            });
        };

        const menu = () => {
            switch (currentMenu){
                case 'emoji':
                    return <EmojiSelector handleEmoji={ this.handleInsertEmoji } />;
                case 'stickers':
                    return <StickerSelector handleSticker={ this.handleInsertSticker } />;
                default:
                    return '';
            }
        };

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    { btns() }
                </div>
                { menu() }
                <div
                    className={ composerClass }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }>
                    <div
                        id="composer"
                        ref={ element => this.composer = element }
                        onKeyUp={ this.handleKeyUp } />
                </div>
                <div className="composer-button">
                    <Button type="submit" btnType="main" btnText="Share it!" onClick={ this.submitPost } />
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentMenu: state.composer.currentMenu
    };
})(Composer);
