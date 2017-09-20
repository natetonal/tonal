import React, { Component } from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import validator from 'validator';
import shallowCompare from 'shallow-compare';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    changeMenu,
    updateValue,
    setPreviewImage,
    setImageUpload,
    updateSuggestionQuery
} from 'actions/ComposerActions';
import Alert from 'elements/Alert';

import {
    getPathFromShortname,
    isEmoji
} from './emojiselector/emojidata';
import Medium from './medium';
import {
    parsePost,
    validatePost
} from './processpost';

import MentionSuggestions from './mentionsuggestions/MentionSuggestions';
import EmojiSelector from './emojiselector/EmojiSelector';
import GiphySelector from './giphyselector/GiphySelector';
import ComposerImagePreviewer from './ComposerImagePreviewer';
import ComposerImageUploader from './ComposerImageUploader';

// Regex strings
const stripHTML = /<\/?(span|font|p)[^>]*>/gi;
const stripAltTag = /(^|\B):([_-a-zA-Z0-9._]+)(\b|\r):(?=")/gi;
const matchImgTag = /<\/?(?=img)[^>]*>/gi;
const linkRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-z()A-Z0-9@:%_\+.~#?&//=]*)\b/g;
const mentionRegex = /(^|\B)@\b([_-a-zA-Z0-9._]{2,25})\b/gi;
const hashtagRegex = /(^|\B)#(?![-0-9_]+\b)([-a-zA-Z0-9_]{1,30})(\b|\r)(?!<)/g;
const emojiRegex = /:([_-a-zA-Z0-9.]+):(?!")/gi;
const countChars = /[^><]+?(?=<|$)|<\/?(?=img)[^>]*>/gi;
const escapeCharsRegex = /&lt;|&gt;|&amp;|&nbsp;/gi;

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

class Composer extends Component {

    // Initialize local state. Optionally assign props to state.
    componentWillMount(){
        this.setState({
            focused: false,
            enabled: true,
            error: false,
            warning: false,
            pos: '',
            history: [],
            submitText: this.props.submitText,
            prevData: this.props.prevData || false,
            avatar: this.props.avatar || false,
            mentions: this.props.prevData ? this.props.prevData.mentions : false,
            initialValue: this.props.initialValue || this.props.currentValue,
            maxLength: this.props.maxLength || 2000,
            containerClass: this.props.containerClass || 'header-compose-post',
            mainClass: this.props.mainClass || 'composer',
            buttonPos: this.props.buttonPos || 'top',
            buttonIcon: this.props.buttonIcon || false,
            buttonType: this.props.buttonType || 'info',
            buttons: this.props.buttons || controlBtns
        });
    }

    // Implement a new Medium when component mounts, and focus on it.
    // Set previous image & file to props when mounted.
    componentDidMount(){
        const {
            initialValue,
            prevData
        } = this.state;

        this.mediumSettings = {
            element: this.composer,
            mode: Medium.partialMode,
            tags: null,
            autofocus: true,
            attributes: null
        };
        this.resetMedium();
        this.composer.focus();
        this.medium.value(initialValue);
        select(this.composer, { start: initialValue.length });
        this.pos = select(this.composer);

        if (prevData){
            if (prevData.image){
                this.handleInsertImage(prevData.image);
            }

            if (prevData.file){
                this.handleUploadFile(prevData.file);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidUpdate(){
        // Make sure focus stays on composer unless selection menu open.
        const { currentMenu, query } = this.props;
        if (currentMenu === '' || query){
            this.composer.focus();
        }
    }

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
                        if (htmlContent.charAt(htmlIndex) === ';') {
                            htmlIndex -= 1; // entity is char itself
                        }
                        insideHtml = false;
                    }
                    htmlIndex += 1;

                }
            }

            textIndex += 1;
            htmlIndex += 1;

        }
        return htmlIndex;
    }

    // This gets the caret position by first using the getHTMLCaretPosition function, then
    // running it through checkLen to determine the "true" location with emoji considered.
    getRelativeCaretPosition(ignoreEmoji = false) {
        const currentPos = this.getHTMLCaretPosition();
        const currentContent = this.medium.value();
        const preStr = currentContent.substr(0, currentPos);
        const len = this.checkLen(preStr, ignoreEmoji);
        return len;
    }

    // Keep a running history of composer states.
    updateHistory(value){
        const { dispatch } = this.props;
        const { history } = this.state;
        history.unshift(value);
        if (history.length > 2){
            history.pop();
        }
        this.setState({ history });
    }

    revertHistory(){
        const { history } = this.state;
        this.medium.value(history[1]);
        this.updateHistory(this.medium.value());
    }

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
        dispatch(updateSuggestionQuery(word));
        this.checkIfMentionsRemoved(textContent);
    }

    // Check if any mentions have been removed from input.
    checkIfMentionsRemoved(textContent){
        const { mentions } = this.state;
        const updatedMentions = [];
        if (mentions){
            mentions.forEach(mention => {
                if (textContent.match(mention.displayName)){
                    updatedMentions.push(mention);
                }
            });
        }
        this.setState({ mentions: updatedMentions });
    }

    // Replace the @mention with the user's full name in place.
    handleMention(user, query){
        const textContent = this.composer.textContent;
        const word = `@${ query }`;
        if (textContent.match(word)){
            const { mentions } = this.state;
            const updates = mentions && [];
            updates.push(user);
            this.setState({ mentions: updates });
            const innerHTML = this.medium.value();
            const updatedHTML = innerHTML.replace(word, `${ user.displayName }&nbsp;`);
            const decoratedHTML = this.decorateEntities(updatedHTML);
            const pos = select(this.composer).end;
            this.medium.value(decoratedHTML);
            this.updateHistory(decoratedHTML);
            this.checkMax(decoratedHTML);
            select(this.composer, { start: pos + user.displayName.length });
        }
        this.clearMenus();
    }

    // A list of entities used to decorate the composer.
    // Note: if a new entity is added later, processpost.js will have to be updated.

    entityTypes(){
        const { mainClass } = this.state;

        return [
            {
                name: 'emoji',
                regex: emojiRegex,
                className: `${ mainClass }-emoji`,
                tag: 'img',
                strategy: this.decorateEmoji,
            },
            {
                name: 'link',
                regex: linkRegex,
                className: `${ mainClass }-link`,
                tag: 'span',
                strategy: this.decorateLinksAndHashtags,
            },
            {
                name: 'mention',
                className: `${ mainClass }-mention`,
                tag: 'span',
                strategy: this.decorateMentions,
                editable: false
            },
            {
                name: 'hashtag',
                regex: hashtagRegex,
                className: `${ mainClass }-hashtag`,
                tag: 'span',
                strategy: this.decorateLinksAndHashtags
            }
        ];
    }

    resetMedium(){
        this.medium = new Medium(this.mediumSettings);
    }

    handlePaste(evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.pos = select(this.composer);
        const index = this.getHTMLCaretPosition();
        const textIndex = this.pos.end;
        const clipboardData = evt.clipboardData || window.clipboardData;
        const pastedData = validator.blacklist(clipboardData.getData('Text'), '<>&');
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
        this.checkMentions(this.composer.textContent);
    }

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
    }

    handleDrop(evt){
        evt.stopPropagation();
        evt.preventDefault();
    }

    handleFocus(){
        this.setState({ focused: true });
    }

    handleBlur(){
        this.setState({ focused: false });
    }

    handleKeyPress({ key, target: { textContent }}){
        const { dispatch } = this.props;

        this.clearError();
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

        dispatch(updateValue(this.medium.value()));
    }

    handleInsertImage(path){
        this.clearMenus();
        const { dispatch } = this.props;
        dispatch(setPreviewImage(path));
    }

    // note: this function is also passed a "path" argument
    handleInsertEmoji(shortname){
        this.clearMenus();
        this.medium.focus();
        const innerHTML = this.medium.value();
        const index = this.getHTMLCaretPosition();
        const preStr = innerHTML.substr(0, index);
        const postStr = innerHTML.substr(index);
        const emojiText = `${ preStr }${ shortname }${ postStr }`;
        this.medium.value(emojiText);
        select(this.composer, { start: this.pos.end + shortname.length });

        this.redecorateContent();
    }

    handleUploadFile(file){
        const { dispatch } = this.props;
        dispatch(setImageUpload(file));
    }

    handleControl(name, evt){
        evt.preventDefault();
        this.clearError();
        this.pos = select(this.composer);
        const { dispatch, currentMenu } = this.props;
        const menu = currentMenu === name ? '' : name;
        dispatch(changeMenu(menu));
    }

    handleWarning(warning = false){
        event.preventDefault();
        const { onClose } = this.props;
        if (warning){
            this.setState({
                warning
            });
        } else {
            onClose();
        }
    }

    clearError(){
        const { error } = this.state;
        if (error){
            this.setState({ error: false });
        }
    }

    clearMenus(){
        const { dispatch } = this.props;
        this.clearError();
        dispatch(changeMenu());
        dispatch(updateSuggestionQuery());
    }

    // Processes passed entities for given input value
    decorateEntities(val = this.medium.value()){
        if (!val){ return ''; }

        const value = this.stripPrevTags(val);
        let decoratedText = value;
        this.entityTypes().forEach(entity => {
            const { strategy } = entity;
            decoratedText = strategy(entity, decoratedText);
        });

        return decoratedText;
    }

    decorateMentions(entity, text){
        const { mentions } = this.state;
        if (!mentions){ return text; }

        const { className, tag, editable } = entity;
        mentions.forEach(user => {
            const newStr = `<${ tag } class="${ className }" ${ editable ? '' : 'contenteditable="false"' }>${ user.displayName }</${ tag }>`;
            text = text.replace(new RegExp(user.displayName), newStr);
        });

        return text;
    }

    decorateLinksAndHashtags(entity, text){
        const { regex, className, tag } = entity;
        if (!text.match(regex)) { return text; }

        let checkArray;
        let adjIndex = 0;
        const newVal = text;
        while ((checkArray = regex.exec(newVal)) !== null){
            let word = checkArray[0];

            ['&nbsp', '&lt', '&gt', '&amp'].forEach(char => {
                if (word.endsWith(char)){
                    word = word.substr(0, word.length - char.length);
                }
            });

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
    }

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
    }

    stripPrevTags(value){
        let newVal = value;
        let checkArray = [];
        while ((checkArray = stripHTML.exec(value)) !== null){
            const thisTag = new RegExp(checkArray[0], 'gi');
            newVal = newVal.replace(thisTag, '');
        }

        return newVal;
    }

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
    }

    redecorateContent(){
        this.pos = select(this.composer);
        const decoratedText = this.decorateEntities();
        const lastChar = decoratedText.charAt(decoratedText.length - 1);
        this.medium.value(`${ lastChar === '>' ? decoratedText + ' ' : decoratedText }`);
        this.updateHistory(this.medium.value());
        this.checkMax(decoratedText);
        this.medium.focus();
        select(this.composer, this.pos);
    }

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
    }

    checkMax(value){
        const { maxLength } = this.state;
        if (this.checkLen(value) > maxLength){
            this.revertHistory();
        }
    }

    submitPost(){
        event.preventDefault();
        const {
            user,
            type,
            onSubmit,
            prevData
        } = this.props;
        const postRaw = this.medium.value();
        const postData = {
            mentions: this.state.mentions.length > 0 ? this.state.mentions : false,
            image: this.props.previewImage,
            file: this.props.imageFile,
            length: this.checkLen()
        };
        const error = validatePost(postRaw, postData);
        if (error){
            this.setState({ error });
        } else {
            this.setState({
                enabled: !this.state.enabled,
                error
            });
            parsePost(postRaw, postData, user, type, prevData)
            .then(parsedPost => {
                if (parsedPost.error){
                    this.handleWarning(parsedPost);
                } else {
                    onSubmit(parsedPost);
                }
            });
        }
    }

    render(){

        console.log('call to composer render.');
        const {
            currentMenu,
            imageUploadProgress,
            imageUploadState,
            query
        } = this.props;

        const {
            focused,
            enabled,
            error,
            avatar,
            warning,
            buttons,
            submitText,
            mainClass,
            containerClass,
            buttonPos,
            buttonIcon,
            buttonType
        } = this.state;

        const cls = {
            zoomIn: `${ mainClass }-zoom-in`,
            disabled: `${ mainClass }-disabled`,
            controls: `${ mainClass }-controls ${ buttonPos === 'bottom' ? buttonPos : '' }`,
            control: `${ mainClass }-control`,
            avatar: `${ mainClass }-avatar`,
            controlLabel: `${ mainClass }-control-label`,
            imgPrev: `${ mainClass }-image-previewer`,
            btn: `${ mainClass }-button`,
            error: `${ mainClass }-error`,
            errorHighlight: `${ mainClass }-highlight-err`
        };

        const composerClass = `${ mainClass } ${ focused ? cls.zoomIn : '' } ${ enabled ? '' : cls.disabled } ${ error ? cls.errorHighlight : '' }`;

        const err = () => {
            if (error){
                return (
                    <ReactCSSTransitionGroup
                        transitionName="smooth-popin"
                        transitionAppear
                        transitionAppearTimeout={ 200 }
                        transitionEnter={ false }
                        transitionLeave={ false }>
                        <div className={ cls.error }>
                            <span>
                                { error }
                            </span>
                        </div>
                    </ReactCSSTransitionGroup>
                );
            }
            return '';
        };

        const warn = () => {
            if (warning){
                const alertBtns = [
                    {
                        text: 'Understood.',
                        callback: () => this.handleWarning()
                    }
                ];
                return (
                    <Alert
                        type="error"
                        fullscreen
                        title={ warning.title }
                        message={ warning.message }
                        buttons={ alertBtns }
                        onClose={ () => this.handleWarning() }
                    />
                );
            }
            return '';
        };

        const btns = () => {
            return buttons.map(btn => {
                const selected = btn.name === currentMenu ? 'selected' : '';

                return (
                    <div
                        key={ btn.name }
                        className={ `${ cls.control } ${ selected }` }
                        onMouseDown={ evt => this.handleControl(btn.name, evt) }>
                        <div className={ cls.controlLabel }>
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

        const imagePreviewer = () => {
            return (
                <ComposerImagePreviewer
                    className={ `${ cls.imgPrev } ${ enabled ? '' : cls.disabled }` }
                    imageUploadProgress={ imageUploadProgress }
                    imageUploadState={ imageUploadState } />
            );
        };

        const av = () => {
            if (avatar){
                return (
                    <div className={ cls.avatar }>
                        <img
                            src={ avatar }
                            alt={ 'avatar bullet' } />
                    </div>
                );
            }

            return '';
        };

        return (
            <div className={ containerClass }>
                { warn() }
                { buttonPos !== 'bottom' && (
                <div className={ cls.controls }>
                    { btns() }
                </div>
                )}
                { menu() }
                { suggestions() }
                <div
                    className={ composerClass }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                    onClick={ this.clearMenus }>
                    { imagePreviewer() }
                    { av() }
                    <div
                        id={ mainClass }
                        ref={ element => this.composer = element }
                        onKeyUp={ e => this.handleKeyPress(e) }
                        onInput={ e => this.checkMentions(e.target.textContent) }
                        onCopy={ this.handleCopy }
                        onPaste={ e => this.handlePaste(e) }
                        onDrop={ this.handleDrop }
                        contentEditable={ enabled } />
                </div>
                { buttonPos === 'bottom' && (
                <div className={ cls.controls }>
                    { btns() }
                </div>
                )}
                { err() }
                <div className={ cls.btn }>
                    <Button
                        type="submit"
                        btnType={ buttonType }
                        btnIcon={ buttonIcon }
                        btnText={ enabled ? submitText : 'Submitting' }
                        isLoading={ !enabled }
                        disabled={ !enabled }
                        onClick={ this.submitPost } />
                </div>
            </div>
        );
    }
}

export default Redux.connect(state => {
    return {
        user: state.user,
        currentValue: state.composer.currentValue,
        imageUploadProgress: state.storage.imageUploadProgress,
        imageUploadState: state.storage.imageUploadState,
        imageFile: state.composer.imageFile,
        previewImage: state.composer.previewImage,
        currentMenu: state.composer.currentMenu,
        query: state.composer.query
    };
})(Composer);
