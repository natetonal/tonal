import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';

import PreviewLink from 'links/PreviewLink';
import Comment from './Comment';
import PostParser from './PostParser';


const bigTextLength = 80;

export const Post = React.createClass({

    render(){

        const { data } = this.props;

        console.log('data received from post: ', data);

        if (data){

            const {
                file,
                image,
                likes,
                mentions,
                post,
                timeStamp,
                thread,
                length,
                user: {
                    avatarPhoto,
                    displayName
                }
            } = data;

            const displayThread = () => {

                if (thread){
                    return Object.keys(thread).map((key) => {
                        const data = thread[key];
                        return (
                            <Comment
                                key={ `comment_${ key }` }
                                data={ data }
                                number={ postNum } />
                        );
                    });
                }
                return (
                    <div>
                        NO COMMENTS
                    </div>
                );
            };

            const displayImage = () => {
                if (image){
                    return (
                        <div className={ `tonal-post-image ${ file ? 'fullwidth' : '' }` }>
                            <img
                                className={ `post-image${ file ? '-fullwidth' : '' }` }
                                src={ image }
                                alt="" />
                        </div>
                    );
                }

                return '';
            };

            return (
                <ReactCSSTransitionGroup
                    transitionName="dramatic-fadein"
                    transitionAppear
                    transitionAppearTimeout={ 500 }
                    transitionEnter={ false }
                    transitionLeave={ false }>
                    <div className="tonal-post">
                        <div className="tonal-post-top">
                            <div className="tonal-post-menu">
                                <i className="fa fa-angle-down" aria-hidden="true" />
                            </div>
                            <div className="tonal-post-avatar">
                                <img
                                    src={ avatarPhoto }
                                    alt={ displayName }
                                    className="tonal-post-1-avatar-photo" />
                            </div>
                            <div className="tonal-post-info">
                                <div className="tonal-post-display-name">{ displayName }</div>
                                <div className="tonal-post-timestamp">
                                    { timeStamp }
                                </div>
                            </div>
                        </div>
                        <PostParser
                            post={ post }
                            className={ `tonal-post-message ${ bigTextLength < length ? '' : 'large' }` } />
                        { displayImage() }
                        <div className="tonal-post-interactions">
                            <div className="tonal-post-interaction tonal-post-interaction-like">
                                <i className="fa fa-bolt" aria-hidden="true" />
                                Like
                            </div>
                            <div className="tonal-post-interaction tonal-post-interaction-reply">
                                <i className="fa fa-comment" aria-hidden="true" />
                                Reply
                            </div>
                            <div className="tonal-post-interaction tonal-post-interaction-share">
                                <i className="fa fa-share" aria-hidden="true" />
                                Share
                            </div>
                            <div className="tonal-post-interaction tonal-post-interaction-likes">
                                { likes } Likes
                            </div>
                        </div>
                        <div className="tonal-post-thread">
                            { displayThread() }
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return <div>NO POSTS YET LOL!</div>;
    }
});

export default Redux.connect()(Post);
