
import React, { Component } from 'react';
import { connect } from 'react-redux';

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

export default connect(state => {
    return {
        currentTitleDisplay: state.emojiSelector.currentTitleDisplay
    };
})(EmojiSelectorTitle);
