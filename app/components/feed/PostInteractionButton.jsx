import React, { Component } from 'react';

import PostInteractionIcon from './PostInteractionIcon';
import PostInteractionCounter from './PostInteractionCounter';
import PostInteractionHandler from './PostInteractionHandler';

class PostInteractionButton extends Component {

    componentWillMount(){
        this.setState({ isPlay: false });
    }

    // shouldComponentUpdate(n, nextState){
    //     if (this.state.isPlay !== nextState.isPlay){
    //         return false;
    //     }
    //
    //     return true;
    // }

    handleClickLike(event){
        console.log('CLEECK');
        if (event){
            event.preventDefault();
        }
        this.setState({ isPlay: true });
        this.props.button.handler();
    }

    stopAnimateLike(){
        this.setState({ isPlay: false });
    }

    render(){

        const {
            uniqueId,
            button
        } = this.props;

        const { isPlay } = this.state;

        return (
            <div className={ 'tonal-post-interaction' }>
                <PostInteractionHandler
                    btn={ button }
                    uniqueId={ uniqueId }
                    clickLike={ this.handleClickLike } />
                <PostInteractionIcon
                    key={ `PostInteractionIcon_${ uniqueId }` }
                    onComplete={ this.stopAnimateLike }
                    isPlay={ isPlay }
                    isLiked={ button.btnState }
                    isLikeButton={ button.type === 'like' }
                    icon={ `fa fa-${ button.icon }` }
                    style={{
                        display: 'inline-block'
                    }} />
                <PostInteractionCounter
                    key={ `PostInteractionCounter_${ uniqueId }` }
                    count={ button.count || 0 }
                    style={{
                        display: 'inline-block'
                    }} />
            </div>
        );
    }
}

export default PostInteractionButton;
