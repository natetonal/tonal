
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';
import emojione from 'emojione';

import Medium from './medium';
import EmojiSelector from './EmojiSelector';

const entityTypes = [
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

const stripHTML = /<\/?(span|font|p)[^>]*>/gi; // this dumps styling tags.

export const Composer = React.createClass({

    getInitialState(){
        return {
            focused: false,
            showEmojiSelector: false,
            pos: ''
        };
    },

    componentDidMount(){
        this.mediumSettings = {
            element: this.composer,
            mode: Medium.richMode,
            placeholder: 'Share&nbsp;your&nbsp;thoughts',
            tags: null,
            autofocus: true,
            attributes: null
        };
        this.resetMedium();
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
            } else if (textContent.length === 1){
                const pos = select(this.composer).end;
                this.medium.value(textContent);
                select(this.composer, { start: pos });
            } else {
                const newVal = this.decorateEntities();
                const pos = select(this.composer);
                console.log('newVal for medium: ', newVal);
                this.medium.value(`${ newVal }`);
                select(this.composer, pos);
            }
        }
    },

    handleEmojiBtn(evt){
        console.log('handleEmojiBtn clicked.');
        evt.preventDefault();
        this.setState({ showEmojiSelector: !this.state.showEmojiSelector });
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

    decorateEntities(){
        const value = this.stripPrevTags();
        let decoratedText = value;
        entityTypes.forEach(entity => {
            const { regex, className, tag } = entity;
            let checkArray;
            while ((checkArray = regex.exec(value)) !== null){
                const word = checkArray[0];
                const re = new RegExp(word, 'gi');
                const newStr = this.buildTag(tag, word, className);
                decoratedText = decoratedText.replace(re, newStr);
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

        const { focused, showEmojiSelector } = this.state;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    <div
                        className="composer-control"
                        onMouseDown={ this.handleEmojiBtn }>
                        <i
                            className="fa fa-smile-o"
                            aria-hidden="true" />
                    </div>
                </div>
                { showEmojiSelector && <EmojiSelector /> }
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

export default Redux.connect()(Composer);
