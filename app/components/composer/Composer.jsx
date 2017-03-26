
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import urlRegex from 'superhuman-url-regex';
import validator from 'validator';
import { shortnameToImage } from 'emojione';
import {
    composerChangeMenu,
    composerSetPreviewImage,
    composerSetImageUpload,
    composerUpdateSuggestionQuery
 } from 'actions';
import {
    getPathFromShortname,
    isEmoji
} from './emojiselector/emojidata';

import Medium from './medium';
import MentionSuggestions from './mentionsuggestions/MentionSuggestions';
import EmojiSelector from './emojiselector/EmojiSelector';
import GiphySelector from './giphyselector/GiphySelector';
import ComposerImagePreviewer from './ComposerImagePreviewer';
import ComposerImageUploader from './ComposerImageUploader';

// Regex strings
const stripHTML = /<\/?(span|font|p)[^>]*>/gi;
const stripNonImgTags = /<\/?(?!img)[^>]*>/gi;
const stripAltTag = /(^|\B):([_-a-zA-Z0-9._]+)(\b|\r):(?=")/gi;
const matchImgTag = /<\/?(?=img)[^>]*>/gi;
const matchText = /(\B|^)[^><]+?(?=<|$)/gi;
const linkRegex = urlRegex({ liberal: false });
const mentionRegex = /(^|\B)@\b([_-a-zA-Z0-9._]{2,25})\b/gi;
const hashtagRegex = /(^|\B)#(?![-0-9_]+\b)([-a-zA-Z0-9_]{1,30})(\b|\r)(?!<)/g;
const emojiRegex = /:([_-a-zA-Z0-9.]+):(?!")/gi;
const countChars = /[^><]+?(?=<|$)|<\/?(?=img)[^>]*>/gi;
const escapeCharsRegex = /&lt;|&gt;|&amp;|&nbsp;/gi;
const unescapeCharsRegex = /<|>|&|\s/gi;

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

    // Initialize local state.
    getInitialState(){
        return {
            focused: false,
            mentions: [],
            emoji: [],
            history: [],
            pos: '',
            maxLength: 2000
        };
    },

    // Implement a new Medium when component mounts, and focus on it.
    componentDidMount(){
        this.mediumSettings = {
            element: this.composer,
            mode: Medium.partialMode,
            tags: null,
            autofocus: true,
            attributes: null
        };
        this.resetMedium();
        this.composer.focus();
    },

    // Make sure focus stays on composer unless selection menu open.
    componentDidUpdate(){
        const { currentMenu, query } = this.props;
        if (currentMenu === '' || query){
            this.composer.focus();
        }
    },

    // Find the current caret position relative the inner HTML.
    // MASSIVE thank you to YangombiUmpakati at SO for this wonderful solution
    // http://stackoverflow.com/questions/16736680/get-caret-position-in-contenteditable-div-including-tags
    getHTMLCaretPosition() {
        const { start, end } = this.pos;
        const textPosition = Math.max(start, end);
        if (textPosition === 0) { return 0; }

        const htmlContent = this.medium.value();
        const htmlBeginChars = ['&', '<'];
        const htmlEndChars = [';', '>'];
        let textIndex = 0;
        let htmlIndex = 0;
        let insideHtml = false;

        while (textIndex < textPosition) {

            // check if next character is html and if it is, iterate with htmlIndex to the next non-html character
            while (htmlBeginChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
                // now iterate to the ending char
                insideHtml = true;
                while (insideHtml) {
                    if (htmlEndChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
                        // if (htmlContent.charAt(htmlIndex) === ';') {
                        //     htmlIndex -= 1; // entity is char itself
                        // }
                        insideHtml = false;
                    }
                    htmlIndex += 1;
                }
            }
            htmlIndex += 1;
            textIndex += 1;
        }
        return htmlIndex;
    },

    // This gets the caret position by first using the getHTMLCaretPosition function, then
    // running it through checkLen to determine the "true" location with emoji considered.
    getRelativeCaretPosition(ignoreEmoji = false) {
        const currentPos = this.getHTMLCaretPosition();
        const currentContent = this.medium.value();
        const preStr = currentContent.substr(0, currentPos);
        return this.checkLen(preStr, ignoreEmoji);
    },

    // Keep a running history of composer states.
    updateHistory(value){
        const { history } = this.state;
        history.unshift(value);
        if (history.length > 2){
            history.pop();
        }
        this.setState({ history });
    },

    revertHistory(){
        const { history } = this.state;
        this.medium.value(history[1]);
        this.updateHistory(this.medium.value());
    },

    // See if there are any new mentions coming in.
    checkMentions(textContent){

        const { dispatch } = this.props;
        let word = '';
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

    // Check if any mentions have been removed from input.
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

    // Replace the @mention with the user's full name in place.
    handleMention(user, query){
        const textContent = this.composer.textContent;
        const word = `@${ query }`;
        if (textContent.match(word)){
            const { mentions } = this.state;
            mentions.push(user);
            this.setState({ mentions });
            const innerHTML = this.medium.value();
            const updatedHTML = innerHTML.replace(word, `${ user.fullName }&nbsp;`);
            const decoratedHTML = this.decorateEntities(updatedHTML);
            const pos = select(this.composer).end;
            this.medium.value(decoratedHTML);
            this.updateHistory(decoratedHTML);
            this.checkMax(decoratedHTML);
            select(this.composer, { start: pos + user.fullName.length });
        }
        this.clearMenus();
    },

    // A list of entities used to decorate the composer.
    entityTypes(){
        return [
            {
                name: 'emoji',
                regex: emojiRegex,
                className: 'composer-emoji',
                tag: 'img',
                strategy: this.decorateEmoji
            },
            {
                name: 'link',
                regex: linkRegex,
                className: 'composer-link',
                tag: 'span',
                strategy: this.decorateLinksAndHashtags
            },
            {
                name: 'mention',
                className: 'composer-mention',
                tag: 'span',
                strategy: this.decorateMentions
            },
            {
                name: 'hashtag',
                regex: hashtagRegex,
                className: 'composer-hashtag',
                tag: 'span',
                strategy: this.decorateLinksAndHashtags
            }
        ];
    },

    resetMedium(){
        this.medium = new Medium(this.mediumSettings);
    },

    handlePaste(evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.pos = select(this.composer);
        const index = this.getHTMLCaretPosition();
        const textIndex = this.pos.end;
        const clipboardData = evt.clipboardData || window.clipboardData;
        const pastedData = validator.escape(clipboardData.getData('Text'));
        let decoratedData = this.decorateEntities(pastedData);
        if (decoratedData.charAt(decoratedData.length - 1) === '>'){
            decoratedData += '&nbsp;';
        }
        const htmlLength = this.checkLen(decoratedData, true);
        const text = this.medium.value();
        const preStr = text.substr(0, index);
        const postStr = text.substr(index);
        const pastedText = `${ preStr }${ decoratedData }${ postStr }`;
        this.medium.value(pastedText);
        this.updateHistory(pastedText);
        this.checkMax(pastedText);

        select(this.composer, { start: textIndex + htmlLength });
        // this.redecorateContent();
        this.checkMentions(this.composer.textContent);
    },

    imagesToShortcode(text){
        if (!text.match(matchImgTag)){ return text; }

        let returnText = text;
        let checkArray;
        while ((checkArray = matchImgTag.exec(text)) !== null){
            const thisTag = checkArray[0];
            if (thisTag.match(stripAltTag)){
                const shortcode = thisTag.match(stripAltTag)[0];
                if (shortcode){
                    returnText = returnText.replace(thisTag, shortcode);
                }
            }
        }

        return returnText;
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
                this.pos = select(this.composer);
                this.medium.value(textContent);
                select(this.composer, this.pos);
            } else {
                this.redecorateContent();
            }
        }

    },

    handleInsertImage(path){
        this.clearMenus();
        const { dispatch } = this.props;
        dispatch(composerSetPreviewImage(path));
    },

    // note: this function is also passed a "path" argument
    handleInsertEmoji(shortname){
        this.clearMenus();
        this.medium.focus();
        const innerHTML = this.medium.value();
        const index = this.getRelativeCaretPosition(true);
        const preStr = innerHTML.substr(0, index);
        const postStr = innerHTML.substr(index);
        const emojiText = `${ preStr }${ shortname }${ postStr }`;
        this.medium.value(emojiText);
        select(this.composer, { start: index + shortname.length });

        this.redecorateContent();
    },

    handleUploadFile(file){
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
        if (!val){ return ''; }

        const value = this.stripPrevTags(val);
        let decoratedText = value;
        this.entityTypes().forEach(entity => {
            const { strategy } = entity;
            decoratedText = strategy(entity, decoratedText);
        });

        return decoratedText;
    },

    decorateMentions(entity, text){
        const { mentions } = this.state;
        if (!mentions){ return text; }

        const { className, tag } = entity;
        mentions.forEach(user => {
            const newStr = `<${ tag } class="${ className }" contenteditable="false">${ user.fullName }</${ tag }>`;
            text = text.replace(new RegExp(user.fullName), newStr);
        });

        return text;
    },

    decorateLinksAndHashtags(entity, text){
        const { regex, className, tag } = entity;
        if (!text.match(regex)) { return text; }

        let checkArray;
        let adjIndex = 0;
        const newVal = text;
        while ((checkArray = regex.exec(newVal)) !== null){
            const word = checkArray[0];
            const index = checkArray.index + adjIndex;
            if (!this.shouldIgnoreWord(word)){
                const newStr = `<${ tag } class="${ className }">${ word }</${ tag }>`;
                const preStr = text.substr(0, index);
                const postStr = text.substr(index + word.length);
                text = `${ preStr }${ newStr }${ postStr }`;
                adjIndex += newStr.length - word.length;
            }
        }

        return text;
    },

    decorateEmoji(entity, text){
        const { regex, className, tag } = entity;
        if (!text.match(regex)) { return text; }
        let checkArray;
        const newVal = text;
        while ((checkArray = regex.exec(newVal)) !== null){
            const word = checkArray[0];
            if (isEmoji(word)){
                const path = getPathFromShortname(word);
                const regexStr = `${ word }(?!")`;
                const re = new RegExp(regexStr, 'gi');
                const newStr = `<${ tag } class="${ className }" src="${ path }" alt="${ word }" />&nbsp;`;
                text = text.replace(re, newStr);
                this.pos = {
                    ...this.pos,
                    start: this.pos.start - (word.length - 1),
                    end: this.pos.end - (word.length - 1)
                };
            }
        }

        return text;
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
        this.pos = select(this.composer);
        const decoratedText = this.decorateEntities();
        this.medium.value(`${ decoratedText.charAt(decoratedText.length - 1) === '>' ? decoratedText + ' ' : decoratedText }`);
        this.updateHistory(this.medium.value());
        this.checkMax(decoratedText);
        this.medium.focus();
        select(this.composer, this.pos);
    },

    // Checks the relative length of this block. Emoji can optionally be set to be ignored in the count.
    checkLen(value = this.medium.value(), ignoreEmoji = false){
        let charCount = 0; // Relative index while iterating through blocks.
        let checkArray = [];
        const replaceChars = ['>', '<', '&', ' '];
        const escapeChars = ['&gt;', '&lt', '&amp;', '&nbsp;'];
        while ((checkArray = countChars.exec(value)) !== null){
            const thisBlock = checkArray[0];
            if (thisBlock.match(matchImgTag)){
                charCount += ignoreEmoji ? 0 : 1;
            } else {
                let replaceBlock = thisBlock;
                if (replaceBlock.match(escapeCharsRegex)){
                    escapeChars.forEach((char, index) => {
                        replaceBlock = replaceBlock.replace(new RegExp(char, 'g'), replaceChars[index]);
                    });
                }
                charCount += replaceBlock.length;
            }
        }

        return charCount;
    },

    checkMax(value){
        const { maxLength } = this.state;
        if (this.checkLen(value) > maxLength){
            this.revertHistory();
        }
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
                        onCopy={ this.handleCopy }
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
