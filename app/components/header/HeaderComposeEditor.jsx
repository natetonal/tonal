import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import { fromJS, get } from 'immutable'; // temporary
import Editor from 'draft-js-plugins-editor';
import { EditorState, CompositeDecorator, RichUtils } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

import Button from 'elements/Button';

const mentionPlugin = createMentionPlugin({
    mentions,
    mentionComponent: (props) => (
        <span className={ props.className } onClick={() => console.log(props.mention.get("link")) } >
            { props.decoratedText }
        </span>
    ),
});
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

// temporary fake data
const mentions = fromJS([
  {
    name: 'Max Acree',
    link: 'http://www.tonal.co/Max.Acree',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar1.jpg?alt=media&token=781bf32f-4b8c-4e29-a241-d2339d730d87',
  },
  {
    name: 'Scott Teeple',
    link: 'http://www.tonal.co/Scott.Teeple',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar2.jpg?alt=media&token=8e780831-36be-4dc1-9023-e8e0da091cb8',
  },
  {
    name: 'Julian Tanaka',
    link: 'http://www.tonal.co/Julian.Tanaka',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar3.jpg?alt=media&token=3893b253-da4d-4cdb-be70-e1489daeabb2',
  }
]);
//

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
            editorZoomIn: false,
            suggestions: mentions
        });
    },

    onChange(editorState){
        this.setState({ editorState });
    },

    onSearchChange({ value }){
        this.setState({
            suggestions: defaultSuggestionsFilter(value, mentions),
        });
    },

    onAddMention(){
        // get the mention object selected
    },

    toggleZoomIn(){
        this.setState({ editorZoomIn: !this.state.editorZoomIn })
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
        const HANDLE_REGEX = /\@[\w]+/g;
        this.findWithRegex(HANDLE_REGEX, contentBlock, callback);
    },

    hashtagStrategy(contentBlock, callback){
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
            console.log(matchArr);
        }
    },

    HandleSpan(props){
        return <span {...props} className="editor-handle">{ props.children }</span>;
    },

    HashtagSpan(props){
        return <span {...props} className="editor-hashtag">{ props.children }</span>;
    },

    render(){

        const { editorState, editorZoomIn } = this.state;

        return (
            <div className="header-compose-post">
                <div className={`header-compose-editor ${ editorZoomIn ? "editor-zoom-in" : "" }`}>
                    <Editor editorState={ editorState }
                            onChange={ this.onChange }
                            handleKeyCommand={this.handleKeyCommand }
                            placeholder="Share your thoughts"
                            spellCheck={ true }
                            ref="editor"
                            plugins={ plugins }
                            onFocus={ this.toggleZoomIn }
                            onBlur={ this.toggleZoomIn } />
                    <MentionSuggestions
                            onSearchChange={ this.onSearchChange }
                            suggestions={ this.state.suggestions }
                            onAddMention={ this.onAddMention } />
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
