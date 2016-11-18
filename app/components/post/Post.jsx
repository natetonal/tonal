import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Comment from './Comment';

export const Post = React.createClass({

    render(){

        const { displayName, avatarPhoto, timeStamp, message, likes, thread } = this.props.data;
        const postNum = this.props.number;

        const displayThread = () => {

            if(thread){;
                return Object.keys(thread).map((key) => {
                    const data = thread[key];
                    return(
                        <Comment key={`comment_${key}`} data={ data } number={ postNum } />
                    );
                });
            } else {
                return(
                    <div>
                        <h1>NO COMMENTS LOL</h1>
                    </div>
                );
            }
        };


        return(
            <div className={`tonal-post-${postNum}`}>
                <div className={`tonal-post-top-${postNum}`}>
                    <div className={`tonal-post-menu-${postNum}`}>
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    <div className={`tonal-post-display-name-${postNum}`}>{ displayName }</div>
                    <div className={`tonal-post-avatar-${postNum}`}>
                        <img src={ avatarPhoto } className="tonal-post-1-avatar-photo" />
                    </div>
                    <div className={`tonal-post-timestamp-${postNum}`}>
                        { timeStamp }
                    </div>
                    <div className={`tonal-post-message-${postNum}`}>
                        <h4>{`Post Style #${postNum}`}</h4>
                        <p>{ message }</p>
                    </div>
                </div>
                <div className={`tonal-post-interactions-${postNum}`}>
                    <div className={`tonal-post-interaction-${postNum} tonal-post-interaction-like-${postNum}`}>
                        <i className="fa fa-bolt" aria-hidden="true"></i>
                        Like
                    </div>
                    <div className={`tonal-post-interaction-${postNum} tonal-post-interaction-reply-${postNum}`}>
                        <i className="fa fa-comment" aria-hidden="true"></i>
                        Reply
                    </div>
                    <div className={`tonal-post-interaction-${postNum} tonal-post-interaction-share-${postNum}`}>
                        <i className="fa fa-share" aria-hidden="true"></i>
                        Share
                    </div>
                    <div className={`tonal-post-interaction-${postNum} tonal-post-interaction-likes-${postNum}`}>
                        { likes } Likes
                    </div>
                </div>
                <div className={`tonal-post-thread-${postNum}`}>
                    { displayThread() }
                </div>
            </div>
        );
    }
});

export default Redux.connect()(Post);
