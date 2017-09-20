
import React, { Component } from 'react';
import * as Redux from 'react-redux';

class EmojiSelectorTitle extends Component {

    render(){

        const { currentTitleDisplay } = this.props;

        return (
            <div className="emoji-selector-title">
                { currentTitleDisplay }
            </div>
        );
    }
}

export default Redux.connect(state => {
    return {
        currentTitleDisplay: state.emojiSelector.currentTitleDisplay
    };
})(EmojiSelectorTitle);
