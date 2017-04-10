import React from 'react';
import * as Redux from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import DummyData from './dummydata.json';

const avatarIMG = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';
const offset = 40; // This is to hug the selection window closer to the caret's actual pos.

export const MentionSuggestions = React.createClass({

    componentWillMount(){
        this.setState({
            suggestions: []
        });
    },


    // BIG thank you to Tim Down at SO for this snippet!!
    // http://stackoverflow.com/questions/6846230/coordinates-of-selected-text-in-browser-page
    getSelectionCoords(win) {
        win = win || window;
        const doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type !== "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    x = rect.left;
                    y = rect.top;
                }
                // Fall back to inserting a temporary element
                if (x === 0 && y === 0) {
                    const span = doc.createElement('span');
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild(doc.createTextNode('\u200b'));
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        const spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x, y };
    },

    filterSuggestions(query){
        const suggestions = [];
        const re = new RegExp(query, 'gi');
        DummyData.forEach(user => {
            const { fullName, displayName } = user;
            if (fullName.match(re) || displayName.match(re)){
                suggestions.push(user);
            }
        });

        return suggestions;
    },

    handleClick(user, query, evt){
        evt.preventDefault();
        const { handleMention } = this.props;
        handleMention(user, query);
    },

    render(){

        const { query } = this.props;
        const suggestions = this.filterSuggestions(query);

        if (!suggestions || suggestions.length === 0){
            return <div />;
        }


        const renderSyntaxHighlighting = (word, re, className) => {
            if (!word.match(re)){
                return (
                    <span className={ className }>
                        { `${ className === 'mention-suggestions-username' ? '@' : '' }${ word }` }
                    </span>
                );
            }

            let highlightedText = word.replace(re, '<span class="mention-suggestions-highlight">$&</span>');
            highlightedText = `${ className === 'mention-suggestions-username' ? '@' : '' }${ highlightedText }`;

            return (
                <span
                    className={ className }
                    dangerouslySetInnerHTML={ { __html: highlightedText } } />
            );
        };

        const renderSuggestions = () => {
            const re = new RegExp(query, 'gi');
            return suggestions.map((user, index) => {
                const { fullName, avatar, displayName } = user;

                return (
                    <div
                        key={ fullName + index }
                        className="mention-suggestions-result"
                        onClick={ e => this.handleClick(user, query, e) }>
                        <div className="mention-suggestions-avatar">
                            <img
                                src={ avatar || avatarIMG }
                                alt={ displayName } />
                        </div>
                        <div className="mention-suggestions-info">
                            { renderSyntaxHighlighting(fullName, re, 'mention-suggestions-name') }
                            { renderSyntaxHighlighting(displayName, re, 'mention-suggestions-username') }
                        </div>
                    </div>
                );
            });
        };

        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fade-and-grow"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave
                transitionLeaveTimeout={ 200 }>
                <div
                    className="mention-suggestions"
                    style={ { top: (this.getSelectionCoords().y - offset) } }>
                    { renderSuggestions() }
                </div>
            </ReactCSSTransitionGroup>
        );
    }

});

export default Redux.connect(state => {
    return {
        query: state.composer.query
    };
})(MentionSuggestions);
