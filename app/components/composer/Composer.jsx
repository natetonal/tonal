
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import urlRegex from 'superhuman-url-regex';
import { shortnameToImage } from 'emojione';
import {
    composerChangeMenu,
    composerSetPreviewImage,
    composerSetImageUpload,
    composerUpdateSuggestionQuery
 } from 'actions';

import Medium from './medium';
import MentionSuggestions from './mentionsuggestions/MentionSuggestions';
import EmojiSelector from './emojiselector/EmojiSelector';
import GiphySelector from './giphyselector/GiphySelector';
import ComposerImagePreviewer from './ComposerImagePreviewer';
import ComposerImageUploader from './ComposerImageUploader';

// Regex strings
const stripHTML = /<\/?(span|font|p)[^>]*>/gi;
const linkRegex = urlRegex({ liberal: true });
const mentionRegex = /(^|\B)@\b([_-a-zA-Z0-9._]{2,25})\b/ig;
const hashtagRegex = /(^|\B)#(?![-0-9_]+\b)([-a-zA-Z0-9_]{1,30})(\b|\r)/g;

// You can add new entity types here. It's best to stick with span tags.
const entityTypes = [
    {
        name: 'link',
        regex: linkRegex,
        className: 'composer-link',
        tag: 'span'
    },
    {
        name: 'mention',
        regex: ['grab from state'],
        className: 'composer-mention',
        tag: 'span'
    },
    {
        name: 'hashtag',
        regex: hashtagRegex,
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
    },
    {
        name: 'image',
        icon: 'fa fa-picture-o'
    }
];

// You can add new URLs for the decorator to ignore here.
const regexIgnoreList = [
    'https://cdn.jsdelivr.net/emojione/assets/png/',
    'giphy.com/media/'
];

export const Composer = React.createClass({

    getInitialState(){
        return {
            focused: false,
            showEmojiSelector: false,
            showStickerSelector: false,
            inputHistory: [],
            mentions: [],
            pos: ''
        };
    },

    componentDidMount(){
        this.mediumSettings = {
            element: this.composer,
            mode: Medium.partialMode,
            tags: null,
            autofocus: true,
            attributes: null,
            maxLength: 300
        };
        this.resetMedium();
        this.composer.focus();
    },

    componentDidUpdate(){
        this.composer.focus();
    },

    resetMedium(){
        this.medium = new Medium(this.mediumSettings);
    },

    checkMentions(textContent){

        const { dispatch } = this.props;
        let word = '';

        // See if there are any new mentions coming in:
        if (textContent.match(mentionRegex)){
            let checkArray;
            while ((checkArray = mentionRegex.exec(textContent)) !== null){
                const thisWord = checkArray[0];
                const startIndex = checkArray.index;
                const endIndex = startIndex + thisWord.length;
                const pos = select(this.composer).end;
                if (pos >= startIndex && pos <= endIndex){
                    word = thisWord.substr(1);
                }
            }
        }
        dispatch(composerUpdateSuggestionQuery(word));
        this.checkIfMentionsRemoved(textContent);
    },

    checkIfMentionsRemoved(textContent){
        const { mentions } = this.state;
        const updatedMentions = [];
        if (mentions){
            mentions.forEach(mention => {
                if (textContent.match(mention.fullName)){
                    updatedMentions.push(mention);
                }
            });
        }
        this.setState({ mentions: updatedMentions });
    },

    handleMention(user, query){
        console.log(`user: ${ user.fullName }, query: @${ query }, state query: ${ this.props.query }`);
        const textContent = this.composer.textContent;
        const word = `@${ query }`;
        if (textContent.match(word)){
            const { mentions } = this.state;
            mentions.push(user);
            this.setState({ mentions });
            let innerHTML = this.medium.value();
            let updatedHTML = innerHTML.replace(word, `${ user.fullName }&nbsp;`);
            let decoratedHTML = this.decorateEntities(updatedHTML);
            const pos = select(this.composer).end;
            this.medium.value(decoratedHTML);
            select(this.composer, { start: pos + user.fullName.length });
        }
        this.clearMenus();
    },

    updateInputHistory(newInput){
        const { inputHistory } = this.state;
        inputHistory.push(newInput);
        if (inputHistory.length > 10){
            inputHistory.shift();
        }
        this.setState({ inputHistory });
    },

    handlePaste(evt){
        evt.stopPropagation();
        evt.preventDefault();

        const pos = select(this.composer).end;
        const clipboardData = evt.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('Text');

        select(this.composer, { start: pos });
        this.medium.insertHtml(shortnameToImage(pastedData));
        this.redecorateContent();
        this.checkMentions(this.composer.textContent);
    },

    handleDrop(evt){
        evt.stopPropagation();
        evt.preventDefault();
    },

    handleFocus(){
        this.setState({ focused: true });
    },

    handleBlur(){
        this.setState({ focused: false });
    },

    handleKeyPress({ key, target: { textContent } }){
        if (key.length === 1){
            if (textContent.length === 0){
                this.resetMedium();
                this.medium.value('');
            } else if (textContent.length === 1){
                const pos = select(this.composer).end;
                this.medium.value(textContent);
                select(this.composer, { start: pos });
            } else {
                this.redecorateContent();
            }
        }
    },

    handleInsertImage(path){
        const { dispatch } = this.props;
        this.clearMenus();
        dispatch(composerSetPreviewImage(path));
    },

    handleInsertEmoji(shortname, path){
        this.clearMenus();
        this.medium.focus();
        if (this.pos && !this.pos.atStart) {
            select(this.composer, this.pos);
        }
        this.medium.insertHtml(`&nbsp;<img class="composer-emoji" src=${ path } alt=${ shortname } />&nbsp;`);
    },

    handleUploadFile(file){
        console.log('File received: ', file);
        const { dispatch } = this.props;
        dispatch(composerSetImageUpload(file));
    },

    handleControl(name, evt){
        evt.preventDefault();
        this.pos = select(this.composer);
        const { dispatch, currentMenu } = this.props;
        const menu = currentMenu === name ? '' : name;
        dispatch(composerChangeMenu(menu));
    },

    clearMenus(){
        const { dispatch } = this.props;
        dispatch(composerChangeMenu());
        dispatch(composerUpdateSuggestionQuery());
    },

    // Strips down the current innerHTML value's style decorators
    decorateEntities(val = this.medium.value()){
        const value = this.stripPrevTags(val);
        let decoratedText = value;
        entityTypes.forEach(entity => {
            const { regex, className, tag } = entity;
            if (Array.isArray(regex)){
                const { mentions } = this.state;
                if (mentions){
                    mentions.forEach(user => {
                        const index = decoratedText.match(user.fullName).index;
                        const newStr = `<${ tag } class="${ className }" contenteditable="false">${ user.fullName }</${ tag }>`;
                        const preStr = decoratedText.substr(0, index);
                        const postStr = decoratedText.substr(index + user.fullName.length);
                        decoratedText = `${ preStr }${ newStr }${ postStr }`;
                    });
                }
            } else if (!Array.isArray(regex) && decoratedText.match(regex)){
                let checkArray;
                let adjIndex = 0;
                const newVal = decoratedText;
                while ((checkArray = regex.exec(newVal)) !== null){
                    const word = checkArray[0];
                    const index = checkArray.index + adjIndex;
                    if (!this.shouldIgnoreWord(word)){
                        const newStr = `<${ tag } class="${ className }">${ word }</${ tag }>`;
                        const preStr = decoratedText.substr(0, index);
                        const postStr = decoratedText.substr(index + word.length);
                        decoratedText = `${ preStr }${ newStr }${ postStr }`;
                        adjIndex += newStr.length - word.length;
                    }
                }
            }
        });

        return decoratedText;
    },

    stripPrevTags(value){
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

    redecorateContent(){
        const newVal = this.decorateEntities();
        const pos = select(this.composer);
        this.medium.value(`${ newVal }`);
        select(this.composer, pos);
    },

    submitPost(){
        event.preventDefault();
    },

    render(){

        const { focused } = this.state;
        const { currentMenu, query } = this.props;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        const btns = () => {
            return controlBtns.map(btn => {
                const selected = btn.name === currentMenu ? 'selected' : '';

                return (
                    <div
                        key={ btn.name }
                        className={ `composer-control ${ selected }` }
                        onMouseDown={ evt => this.handleControl(btn.name, evt) }>
                        <div className="composer-control-label">
                            { btn.name }
                        </div>
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
                    component = <GiphySelector handleGiphy={ this.handleInsertImage } />;
                    break;
                case 'gifs':
                    component = <GiphySelector handleGiphy={ this.handleInsertImage } />;
                    break;
                case 'image':
                    component = (
                        <ComposerImageUploader
                            handleImage={ this.handleInsertImage }
                            handleFile={ this.handleUploadFile } />
                    );
                    break;
                default:
                    return '';
            }

            return component;
        };

        const suggestions = () => {
            if (query){
                return <MentionSuggestions handleMention={ this.handleMention } />;
            }
            return '';
        };

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    { btns() }
                </div>
                { menu() }
                { suggestions() }
                <div
                    className={ composerClass }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                    onClick={ this.clearMenus }>
                    <ComposerImagePreviewer />
                    <div
                        id="composer"
                        ref={ element => this.composer = element }
                        onKeyUp={ e => this.handleKeyPress(e) }
                        onInput={ e => this.checkMentions(e.target.textContent) }
                        onPaste={ e => this.handlePaste(e) }
                        onDrop={ this.handleDrop } />
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
        currentMenu: state.composer.currentMenu,
        query: state.composer.query
    };
})(Composer);
