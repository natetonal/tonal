
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';
import select from 'selection-range';

import Medium from './medium';


const entityTypes = [
    {
        name: 'mention',
        regex: /(^|\B)@\b([-a-zA-Z0-9._]{3,25})\b/ig,
        className: 'composer-mention',
        tag: 'span'
    },
    {
        name: 'hashtag',
        regex: /(^|\B)#\b([-a-zA-Z0-9._]{1,30})\b/ig,
        className: 'composer-hashtag',
        tag: 'span'
    }
];

const stripHTML = /<\/?(span|font|p)[^>]*>/gi; // this dumps styling tags.

export const Composer2 = React.createClass({

    getInitialState(){
        return {
            focused: false,
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

    handleHashtag(evt, element){
        console.log('handleHashtag evoked: ', element);
    },

    handleMention(evt, element){
        console.log('handleMention evoked: ', element);
    },

    submitPost(){
        event.preventDefault();
        console.log('Formatted post for submission: ?');
    },

    handleFocus(){
        this.setState({ focused: true });
    },

    handleBlur(){
        this.setState({ focused: false });
    },

    handleKeyUp({ key, target: { textContent } }){
        if (key !== 'Enter'){
            console.log('key: ', key);
            console.log('keyUp: ', select(this.composer));
            console.log('A. this.textContent: ', textContent);
            console.log('B. this.composer position: ', select(this.composer));

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
        console.log('this.composer position: ', select(this.composer));
        console.log('this.medium.value: ', this.medium.value());

    },

    handleInput({ target: { textContent } }){

    },

    handleBtnClick(evt){
        console.log('handleBtnClick: btn clicked!');
        evt.preventDefault();
        this.medium.focus();
        this.medium.insertHtml('<span style="color: lime">:-)</span>&nbsp;');
    },

    buildTag(tag, word, className){
        return `<${ tag } class="${ className }">${ word }</${ tag }>`;
    },

    escapeRegExp(str) {
        return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },

    stripPrevTags(){
        const value = this.medium.value();
        let newVal = value;
        let checkArray = [];
        console.log('C. this.medium.value: ', this.medium.value());
        while ((checkArray = stripHTML.exec(value)) !== null){
            console.log('D. checkArray[0]: ', checkArray[0]);
            const thisTag = new RegExp(checkArray[0], 'gi');
            console.log('E. thisTag: ', thisTag);
            newVal = newVal.replace(thisTag, '');
            console.log('F. newVal (in loop): ', newVal);
        }
        console.log('G. newVal: ', newVal);

        return newVal;
    },

    decorateEntities(){
        const value = this.stripPrevTags();
        console.log('H. value (from this.stripPrevTags): ', value);
        let decoratedText = value;
        entityTypes.forEach(entity => {
            console.log('I. entity: ', entity);
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

    render(){

        const { focused } = this.state;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    <div
                        className="composer-control"
                        onMouseDown={ this.handleBtnClick }>
                        <i
                            className="fa fa-smile-o"
                            aria-hidden="true" />
                    </div>
                </div>
                <div
                    className={ composerClass }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }>
                    <div
                        id="composer"
                        ref={ element => this.composer = element }
                        onInput={ this.handleInput }
                        onKeyUp={ this.handleKeyUp } />
                </div>
                <div className="composer-button">
                    <Button type="submit" btnType="main" btnText="Share it!" onClick={ this.submitPost } />
                </div>
            </div>
        );
    }
});

export default Redux.connect()(Composer2);
