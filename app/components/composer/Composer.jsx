import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import { fromJS, get, set } from 'immutable'; // temporary
import validator from 'validator';
import Button from 'elements/Button';
import select from 'selection-range';

import EditableDiv from './EditableDiv';

const placeholder = '<span class="composer-placeholder">Share your thoughts</span>';
const entityTypes = [
    {
        name: 'mention',
        type: 'wrap',
        regex: /(^|\B)@\b([-a-zA-Z0-9._]{3,25})\b/ig,
        className: 'composer-mention',
        tag: 'span'
    },
    {
        name: 'hashtag',
        type: 'wrap',
        regex: /(^|\B)#\b([-a-zA-Z0-9._]{1,30})\b/ig,
        className: 'composer-hashtag',
        tag: 'span'
    },
    {
        name: 'linebreak',
        type: 'single',
        regex: /(?!".*)\n(?!.*")/ig,
        tag: 'br'
    }
];

export const Composer = React.createClass({

    componentWillMount(){
        this.setState({
            editorZoomIn: false,
            placeholder: true,
            mentions: [],
            hashtags: [],
            html: placeholder,
        });
    },

    decorateEntities(value){
        var decoratedText = value;
        entityTypes.forEach(entity => {
            const { type, regex, className, tag } = entity;
            var tempArray = [];
            let checkArray;
            while ((checkArray = regex.exec(value)) !== null){
                tempArray.push(checkArray[0]);
            }

            tempArray.forEach(word => {
                const re = new RegExp(word, "gi");
                const newStr = type === 'wrap' ?
                               `<${tag} class='${className}'>${word}</${tag}>` :
                               `<${tag} />`;
                decoratedText = decoratedText.replace(re, newStr);
            });
        });

        console.log('decoratedText: ', decoratedText);
        return decoratedText;
    },

    handleChange({ target: { textContent, value, cursorPos }}){
        var newHTML = value;
        console.log('this.composer.htmlEl: ', this.composer.htmlEl);
        if(!textContent){
            this.setState({
                html: placeholder,
                placeholder: true
            });
        } else {
            newHTML = this.decorateEntities(textContent);
            this.setState({ html: newHTML });
        }


        select(this.composer.htmlEl, { start: cursorPos });
    },

    handleKeyPress({ key, target: { textContent }}){
        console.log('key pressed: ', key);
        switch(key){
            case '@':
                console.log('@ pressed - execute mention function.');
                break;
            case ':':
                console.log(': pressed - execute emoji function.');
                break;
            case '#':
                console.log('# pressed - execute hashtag function.');
                break;
            default:
                console.log(`${key} pressed - do nothing!`);
                break;
        }
    },

    handleClick(){
        const { placeholder } = this.state;
        if(placeholder){
            this.setState({
                html: '',
                placeholder: false
            });
        }
    },

    handleBlur(){
        const { html } = this.state;
        if(!html){
            this.setState({
                html: placeholder,
                placeholder: true,
                editorZoomIn: !this.state.editorZoomIn
            });
        } else {
            this.setState({ editorZoomIn: !this.state.editorZoomIn })
        }
    },

    handleFocus(){
        const { placeholder } = this.state;
        if(placeholder){
            this.setState({
                html: '',
                placeholder: false,
                editorZoomIn: !this.state.editorZoomIn
            });
        } else {
            this.setState({ editorZoomIn: !this.state.editorZoomIn })
        }
    },

    submitPost(){
        event.preventDefault();
        console.log("Formatted post for submission: ", this.state.html);
    },

    render(){

        const { editorZoomIn, html } = this.state;
        const editableDivClass = `composer ${ editorZoomIn ? "composer-zoom-in" : "" }`;

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    <div className="composer-control">
                        <i className="fa fa-smile-o" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="composer-wrapper">
                    <EditableDiv
                        className={ editableDivClass }
                        onClick={ this.handleClick }
                        onChange={ this.handleChange }
                        onFocus={ this.handleFocus }
                        onBlur={ this.handleBlur }
                        onKeyPress={ this.handleKeyPress }
                        html={ html }
                        ref={ (e) => this.composer = e }
                        disabled="false" />
                </div>
                <div className="composer-button">
                    <Button type="submit" btnType="main" btnText="Share it!" onClick={ this.submitPost }/>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {

     };
})(Composer);
