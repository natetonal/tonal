import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';

import {
    TimelineLite,
    Power1,
} from 'gsap';
import {
    deletePost,
    updatePost
} from 'actions/PostActions';

import Composer from 'composer/Composer';
import PreviewLink from 'links/PreviewLink';
import Comment from './Comment';
import PostParser from './PostParser';
import PostMenu from './PostMenu';

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){
        this.setState({
            showMenu: false,
            postEdit: false
        });
    },

    handlePostMenu(){
        this.setState({
            showMenu: !this.state.showMenu
        });
    },

    handleEditPost(){
        const tl = new TimelineLite();
        if (!this.state.postEdit){
            this.toggleEditor();
            tl.from(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        } else {
            tl.to(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
            tl.eventCallback('onComplete', this.toggleEditor);
        }
        tl.play();
    },

    handleUpdatePost(updatedPost){
        const {
            dispatch,
            data: {
                postId
            }
        } = this.props;
        dispatch(updatePost(updatedPost, postId));
    },

    handleDeletePost(){

        console.log('hanldeDeletePost called from post.');

        const tl = new TimelineLite();
        tl.to(this.postRef, 0.25, {
            ease: Power1.easeOut,
            transformOrigin: 'top left',
            height: 0,
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', this.dispatchPostDelete);
    },

    toggleEditor(){
        this.setState({
            postEdit: !this.state.postEdit
        });
    },

    dispatchPostDelete(){
        const {
            dispatch,
            data
        } = this.props;

        const { postId } = data;
        dispatch(deletePost(postId));
    },

    render(){

        const {
            data,
            feedId
        } = this.props;

        if (data){

            const {
                file,
                image,
                likes,
                mentions,
                post,
                raw,
                postEdited,
                postEditedAt,
                timeStamp,
                thread,
                length,
                user,
                postId,
                user: {
                    avatar,
                    displayName
                }
            } = data;

            const {
                showMenu,
                postEdit
            } = this.state;

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

            const displayMenu = () => {
                if (showMenu){
                    return (
                        <PostMenu
                            posterIsSelf={ user.uid === feedId }
                            handlePostMenu={ this.handlePostMenu }
                            handleEditPost={ this.handleEditPost }
                            handleDeletePost={ this.handleDeletePost }
                            postId={ postId } />
                    );
                }

                return '';
            };

            const postMode = () => {
                if (postEdit){
                    return (
                        <div
                            ref={ element => this.postEditorRef = element }
                            className="tonal-post-editor">
                            <div
                                className="tonal-post-editor-close"
                                onClick={ this.handleEditPost }>
                                <i className="fa fa-times" aria-hidden="true" />
                            </div>
                            <Composer
                                initialValue={ raw }
                                mentions={ mentions }
                                submitText={ 'Update Your Post ' }
                                onClose={ this.handleEditPost }
                                onSubmit={ this.handleUpdatePost } />
                        </div>
                    );
                }

                return (
                    <PostParser
                        post={ post }
                        className={ `tonal-post-message ${ bigTextLength < length ? '' : 'large' }` } />
                );
            };

            const displayTimestamp = () => {
                if (postEdited){
                    return `Edited ${ postEditedAt }`;
                }

                return timeStamp;
            };

            return (
                <ReactCSSTransitionGroup
                    transitionName="dramatic-fadein"
                    transitionAppear
                    transitionAppearTimeout={ 500 }
                    transitionEnter={ false }
                    transitionLeave={ false }>
                    <div
                        ref={ element => this.postRef = element }
                        className="tonal-post">
                        <div className="tonal-post-top">
                            <div
                                className="tonal-post-menu"
                                onClick={ this.handlePostMenu }>
                                <i className="fa fa-angle-down" aria-hidden="true" />
                                { displayMenu() }
                            </div>
                            <div className="tonal-post-avatar">
                                <img
                                    src={ avatar }
                                    alt={ displayName }
                                    className="tonal-post-1-avatar-photo" />
                            </div>
                            <div className="tonal-post-info">
                                <div className="tonal-post-display-name">
                                    <PreviewLink
                                        key={ `postLink_${ postId }` }
                                        type="user"
                                        data={ user }
                                        postId={ postId }
                                        className="post-mention"
                                        src={ `users/${ user.username }` }>
                                        { displayName }
                                    </PreviewLink>
                                </div>
                                <div className="tonal-post-timestamp">
                                    { displayTimestamp() }
                                </div>
                            </div>
                        </div>
                        { postMode() }
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
