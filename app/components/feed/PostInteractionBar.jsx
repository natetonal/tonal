import React, { Component } from 'react';

import PostInteractionButton from './PostInteractionButton';

class PostInteractionBar extends Component {

    componentWillMount(){
        this.key = this.createKey();
    }

    createKey(length = 10){
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    render(){

        const {
            like,
            comment,
            share
         } = this.props;

        return (
            <div className="tonal-post-interactions">
                <PostInteractionButton
                    key={ `PostInteractionButtonLike_${ this.key }` }
                    uniqueId={ this.key }
                    button={ like } />
                <PostInteractionButton
                    key={ `PostInteractionButtonComment_${ this.key }` }
                    uniqueId={ this.key }
                    button={ comment } />
                <PostInteractionButton
                    key={ `PostInteractionButtonShare_${ this.key }` }
                    uniqueId={ this.key }
                    button={ share } />
            </div>
        );
    }
}

export default PostInteractionBar;
