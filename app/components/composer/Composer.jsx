
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import urlRegex from 'superhuman-url-regex';

import Medium from './medium';
import EmojiSelector from './emojiselector/EmojiSelector';
import GiphySelector from './giphyselector/GiphySelector';

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
    },
    {
        name: 'gifs',
        icon: 'fa fa-rocket'
    }
];

// You can add new URLs for the decorator to ignore here.
const regexIgnoreList = [
    'https://cdn.jsdelivr.net/emojione/assets/png/',
    'giphy.com/media/'
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
            attributes: null,
            maxLength: 300
        };
        this.resetMedium();
        this.composer.focus();
    },

    resetMedium(){
        this.medium = new Medium(this.mediumSettings);
    },

    handleMention(evt, element){
    },

    handleFocus(){
        this.setState({ focused: true });
    },

    handleBlur(){
        this.setState({ focused: false });
    },

    handleKeyUp({ key, target: { textContent } }){
        if (key.length === 1){
            if (textContent.length === 0){
                this.resetMedium();
                this.medium.value('');
            } else if (textContent.length === 1){
                const pos = select(this.composer).end;
                this.medium.value(textContent);
                select(this.composer, { start: pos });
            } else {
                const newVal = this.decorateEntities();
                const pos = select(this.composer);
                this.medium.value(`${ newVal }`);
                select(this.composer, pos);
            }
        }
    },

    noRepeats(){

    },

    handleInsertGiphy(path){
        const { dispatch } = this.props;
        dispatch(composerChangeMenu());
        this.medium.focus();
        if (this.pos && !this.pos.atStart) {
            select(this.composer, this.pos);
        }
        this.medium.insertHtml(`&nbsp;<img class="composer-sticker" src=${ path } alt=${ path } />&nbsp;`);
    },

    handleInsertEmoji(shortname, path){
        const { dispatch } = this.props;
        dispatch(composerChangeMenu());
        this.medium.focus();
        if (this.pos && !this.pos.atStart) {
            select(this.composer, this.pos);
        }
        this.medium.insertHtml(`&nbsp;<img class="composer-emoji" src=${ path } alt=${ shortname } />&nbsp;`);
    },

    // refactor this shit.
    handleControl(name, evt){
        evt.preventDefault();
        this.pos = select(this.composer);
        const { dispatch, currentMenu } = this.props;
        const menu = currentMenu === name ? '' : name;
        dispatch(composerChangeMenu(menu));
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
                let adjIndex = 0;
                const newVal = decoratedText;
                while ((checkArray = regex.exec(newVal)) !== null){
                    const word = checkArray[0];
                    const index = checkArray.index + adjIndex;
                    if (!this.shouldIgnoreWord(word)){
                        const newStr = this.buildTag(tag, word, className);
                        const preStr = decoratedText.substr(0, index);
                        const postStr = decoratedText.substr(index + word.length);
                        decoratedText = `${ preStr }${ newStr }${ postStr }`;
                        adjIndex += newStr.length - word.length;
                        // decoratedText = decoratedText.replace(re, newStr);
                    }
                }
            }
        });


        return decoratedText;
    },

    submitPost(){
        event.preventDefault();
    },

    render(){

        const { focused } = this.state;
        const { currentMenu } = this.props;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        const btns = () => {
            return controlBtns.map(btn => {
                const selected = btn.name === currentMenu ? 'selected' : '';

                return (
                    <div
                        key={ btn.name }
                        className={ `composer-control ${ selected }` }
                        onMouseDown={ evt => this.handleControl(btn.name, evt) }>
                        <i
                            className={ btn.icon }
                            aria-hidden="true" />
                    </div>
                );
            });
        };

        const menu = () => {
            let component;
            switch (currentMenu){
                case 'emoji':
                    component = <EmojiSelector handleEmoji={ this.handleInsertEmoji } />;
                    break;
                case 'stickers':
                case 'gifs':
                    component = <GiphySelector handleGiphy={ this.handleInsertGiphy } />;
                    break;
                default:
                    return '';
            }

            return component;
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
