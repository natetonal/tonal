import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import { fromJS, get, set } from 'immutable'; // temporary

import Button from 'elements/Button';

// Draft.js editor & plugins:
import Editor from 'draft-js-plugins-editor';
import { convertToRaw, EditorState, Entity, Modifier, CompositeDecorator, AtomicBlockUtils } from 'draft-js';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { shortnameToUnicode } from 'emojione/lib/js/emojione';
import EmojiPicker from 'emojione-picker';

// Draft.js plugin setup:
const mentionPlugin = createMentionPlugin({
    mentions,
    mentionComponent: (props) => (
        <span className={ props.className } onClick={() => console.log(props.mention.get("link")) } >
            { props.decoratedText }
        </span>
    ),
});
const { MentionSuggestions } = mentionPlugin;

const linkifyPlugin = createLinkifyPlugin({
    component: (props) => (
        <a {...props} className="editor-link" />
    )
});

const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions } = emojiPlugin;

// temporary fake data for mentions menu:
const mentions = fromJS([
    {
  "name": "Frank Alvarez",
  "link": "https://youtu.be/iaculis/congue.xml?congue=vel&vivamus=lectus&metus=in&arcu=quam&adipiscing=fringilla&molestie=rhoncus&hendrerit=mauris&at=enim&vulputate=leo&vitae=rhoncus&nisl=sed&aenean=vestibulum&lectus=sit&pellentesque=amet&eget=cursus&nunc=id&donec=turpis&quis=integer&orci=aliquet&eget=massa&orci=id",
  "avatar": "https://robohash.org/quiadoloressed.png?size=50x50&set=set1"
}, {
  "name": "Joan Fuller",
  "link": "http://ihg.com/quisque/ut/erat/curabitur/gravida/nisi.xml?ut=faucibus&at=cursus&dolor=urna&quis=ut&odio=tellus&consequat=nulla&varius=ut&integer=erat&ac=id&leo=mauris&pellentesque=vulputate&ultrices=elementum&mattis=nullam",
  "avatar": "https://robohash.org/quamexaut.bmp?size=50x50&set=set1"
}, {
  "name": "Kimberly Reid",
  "link": "http://angelfire.com/amet/cursus/id/turpis/integer.jsp?non=enim&ligula=in&pellentesque=tempor&ultrices=turpis&phasellus=nec&id=euismod&sapien=scelerisque&in=quam&sapien=turpis&iaculis=adipiscing&congue=lorem&vivamus=vitae&metus=mattis&arcu=nibh&adipiscing=ligula&molestie=nec&hendrerit=sem&at=duis&vulputate=aliquam&vitae=convallis&nisl=nunc&aenean=proin&lectus=at&pellentesque=turpis&eget=a&nunc=pede&donec=posuere&quis=nonummy&orci=integer&eget=non&orci=velit&vehicula=donec&condimentum=diam&curabitur=neque&in=vestibulum&libero=eget&ut=vulputate&massa=ut&volutpat=ultrices&convallis=vel&morbi=augue&odio=vestibulum&odio=ante&elementum=ipsum&eu=primis&interdum=in&eu=faucibus&tincidunt=orci&in=luctus&leo=et&maecenas=ultrices&pulvinar=posuere&lobortis=cubilia&est=curae&phasellus=donec&sit=pharetra&amet=magna&erat=vestibulum&nulla=aliquet&tempus=ultrices&vivamus=erat&in=tortor&felis=sollicitudin&eu=mi&sapien=sit&cursus=amet&vestibulum=lobortis&proin=sapien&eu=sapien&mi=non&nulla=mi&ac=integer&enim=ac&in=neque&tempor=duis&turpis=bibendum&nec=morbi&euismod=non&scelerisque=quam&quam=nec&turpis=dui&adipiscing=luctus&lorem=rutrum",
  "avatar": "https://robohash.org/utquiaaut.png?size=50x50&set=set1"
}]);

// Draft.js plugins array:
const plugins = [
    mentionPlugin,
    linkifyPlugin,
    emojiPlugin
];

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
            showEmojiPicker: false,
            suggestions: mentions
        });
    },

    onChange(editorState){
        console.log("EditorState raw: ", convertToRaw(editorState.getCurrentContent()));
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

    getSearchText(editorState, selection) {
        const anchorKey = selection.getAnchorKey();
        const anchorOffset = selection.getAnchorOffset() - 1;
        const currentContent = editorState.getCurrentContent();
        const currentBlock = currentContent.getBlockForKey(anchorKey);
        const blockText = currentBlock.getText();
        return this.getWordAt(blockText, anchorOffset);
    },

    getWordAt(string, position) {
        // Perform type conversions.
        var str = String(string);
        // eslint-disable-next-line no-bitwise
        var pos = Number(position) >>> 0;

        // Search for the word's beginning and end.
        var left = str.slice(0, pos + 1).search(/\S+$/);
        var right = str.slice(pos).search(/\s/);

        // The last word in the string is a special case.
        if (right < 0) {
            return {
                word: str.slice(left),
                begin: left,
                end: str.length
            };
        }

        // Return the word, using the located bounds to extract it from the string.
        return {
            word: str.slice(left, right + pos),
            begin: left,
            end: right + pos
        };
    },

    addEmoji(editorState, emoji) {
        const currentSelectionState = editorState.getSelection();
        const { begin, end } = this.getSearchText(editorState, currentSelectionState);

        console.log("begin & end: ", begin, end);
        // Get the selection of the :emoji: search text
        const emojiTextSelection = currentSelectionState.merge({
            anchorOffset: begin,
            focusOffset: end,
        });

        console.log('emojiTextSelection: ', emojiTextSelection);

        const entityKey = Entity.create('emoji', 'IMMUTABLE', { emojiUnicode: emoji });

        let emojiReplacedContent = Modifier.replaceText(
            editorState.getCurrentContent(),
            emojiTextSelection,
            emoji,
            null,
            entityKey
        );

        console.log('emojiReplacedContent: ', emojiReplacedContent);
        // If the emoji is inserted at the end, a space is appended right after for
        // a smooth writing experience.
        const blockKey = emojiTextSelection.getAnchorKey();
        const blockSize = editorState.getCurrentContent().getBlockForKey(blockKey).getLength();
        if (blockSize === end) {
            emojiReplacedContent = Modifier.insertText(
                emojiReplacedContent,
                emojiReplacedContent.getSelectionAfter(),
                ' ',
            );
        }

        const newEditorState = EditorState.push(
            editorState,
            emojiReplacedContent,
            'insert-emoji',
        );

        console.log('newEditorState: ', convertToRaw(newEditorState.getCurrentContent()));
        return EditorState.forceSelection(newEditorState, emojiReplacedContent.getSelectionAfter());
    },


    onEmojiPickerSelect(data){
        const emoji = shortnameToUnicode(data.shortname);
        const { editorState } = this.state;
        const newEditorState = this.addEmoji(editorState, emoji);

        console.log('newEditorState: ', convertToRaw(newEditorState.getCurrentContent()));

        this.setState({
            editorState: newEditorState,
            showEmojiPicker: false
        });
        this.refs.editor.focus();
    },

    toggleZoomIn(){
        this.setState({ editorZoomIn: !this.state.editorZoomIn })
    },

    toggleEmojiPicker(){
        this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
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

    submitPost(event){
        event.preventDefault();
        const { editorState } = this.state;
        const html = convertToHTML({
            entityToHTML: (entity, originalText) => {
                if(entity.type === 'mention'){
                    return <a href={ entity.data.mention.get('link') }>{ originalText }</a>
                }
                return originalText;
            }
        })(editorState.getCurrentContent());
        console.log("Formatted post for submission: ", html);
    },

    focus(){
        this.refs.editor.focus();
    },

    render(){

        const { editorState, editorZoomIn, showEmojiPicker } = this.state;

        return (
            <div className="header-compose-post">
                <div className="header-compose-editor-controls">
                    <div className="header-compose-editor-control" onClick={ this.toggleEmojiPicker }>
                        <i className="fa fa-smile-o" aria-hidden="true"></i>
                    </div>
                    { showEmojiPicker &&
                        <EmojiPicker onChange={ (data) =>  this.onEmojiPickerSelect(data) } />
                    }
                </div>
                <div className={`header-compose-editor ${ editorZoomIn ? "editor-zoom-in" : "" }`}>
                    <Editor editorState={ editorState }
                            onChange={ this.onChange }
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
                    <EmojiSuggestions />
                </div>
                <div className="header-compose-button">
                    <Button type="submit" btnType="main" btnText="Share it!" onClick={ this.submitPost }/>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {

     };
})(HeaderComposeEditor);
