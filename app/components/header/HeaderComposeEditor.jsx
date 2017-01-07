import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import { Editor, EditorState, RichUtils, CompositeDecorator } from 'draft-js';

import Button from 'elements/Button';

export const HeaderComposeEditor = React.createClass({

    componentWillMount(){

        const compositeDecorator = new CompositeDecorator([
            {
              strategy: this.handleStrategy,
              component: this.HandleSpan,
            },
            {
              strategy: this.hashtagStrategy,
              component: this.HashtagSpan,
            },
        ]);

        this.setState({
            editorState: EditorState.createEmpty(compositeDecorator),
            placeholderEmpty: false
        });
    },

    focusOnEditor(){
        this.refs.editor.focus();
    },

    onChange(editorState){
        this.setState({ editorState });
    },

    _onBoldClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
    },

    _onItalicClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
    },

    _onUnderlineClick(){
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    },

    handleKeyCommand(command){
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    },

    handleStrategy(contentBlock, callback){
        console.log('handleStrategy called with contentBlock: ', contentBlock);
        const HANDLE_REGEX = /\@[\w]+/g;
        this.findWithRegex(HANDLE_REGEX, contentBlock, callback);
    },

    hashtagStrategy(contentBlock, callback){
        console.log('hashtagStrategy called with contentBlock: ', contentBlock);
        const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g;
        this.findWithRegex(HASHTAG_REGEX, contentBlock, callback);
    },

    findWithRegex(regex, contentBlock, callback){
        const text = contentBlock.getText();
        console.log('findWithRegex called with text: ', text);
        let matchArr, start;
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            callback(start, start + matchArr[0].length);
        }
    },

    HandleSpan(props){
        return <span {...props} className="editor-handle">{ props.children }</span>;
    },

    HashtagSpan(props){
        return <span {...props} className="editor-hashtag">{ props.children }</span>;
    },

    render(){

        const { editorState, placeholderEmpty } = this.state;

        return (
            <div className="header-compose-post">
                <div className="header-compose-editor">
                    <Editor editorState={ editorState }
                            onChange={ this.onChange }
                            handleKeyCommand={this.handleKeyCommand }
                            placeholder="Share your thoughts"
                            spellCheck={ true }
                            ref="editor" />
                </div>
                <div className="header-compose-button">
                    <Button type="submit" btnType="main" btnText="Share it!" />
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {

     };
})(HeaderComposeEditor);
