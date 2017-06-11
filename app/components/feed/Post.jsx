import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import moment from 'moment';
import {
    TweenLite,
    TimelineLite,
    Power1,
} from 'gsap';

import Composer from 'composer/Composer';
import PreviewLink from 'links/PreviewLink';
import SmallMenu from 'elements/SmallMenu';
import Comment from './Comment';
import PostParser from './PostParser';

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){
        this.setState({
            showMenu: false,
            timeStamp: moment(this.props.data.timeStamp, 'LLLL').fromNow()
        });
    },

    componentDidMount(){
        this.interval = setInterval(this.updateTimestamp, 1000);
    },

    componentWillReceiveProps(nextProps){

        // If the user opens the editor:
        if (this.props.editing === this.props.postId &&
            !nextProps.editing){
            TweenLite.from(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        }

        // If the user has finished editing the post:
        if (nextProps.editing === nextProps.postId &&
            !this.props.editing){
            TweenLite.to(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        }
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.timeStamp !== this.state.timeStamp){
            const tl = new TimelineLite();
            tl.from(this.timeStampRef, 0.5, {
                ease: Power1.easeOut,
                opacity: 0
            });
            tl.play();
        }
    },

    componentWillUnmount(){
        clearInterval(this.interval);
    },

    updateTimestamp(){
        this.setState({
            timeStamp: moment(this.props.data.timeStamp, 'LLLL').fromNow()
        });
    },

    handlePostMenu(){
        this.setState({
            showMenu: !this.state.showMenu
        });
    },

    handleDeletePost(){

        const {
            deletePost,
            postId
        } = this.props;

        const tl = new TimelineLite();
        tl.to(this.postRef, 0.25, {
            ease: Power1.easeOut,
            transformOrigin: 'top left',
            height: 0,
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', deletePost, [postId]);
    },

    render(){

        // Post object should be refactored.
        // Author: uid.
        // Unsubscribed:(uid: true)
        // Flagged: 0

        const {
            feedId,
            postId,
            data,
            editing,
            following,
            blocked,
            blockedBy,
            posterIsSelf,
            isFollowing,
            isBlocked,
            isBlockedBy,
            isSelf,
            deletePost,
            updatePost,
            blockUser,
            followUser,
            togglePostEditor
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
                thread,
                length,
                user
            } = data;

            const {
                uid,
                avatar,
                displayName,
                username
            } = user;

            const {
                showMenu,
                timeStamp
            } = this.state;

            const displayMenu = () => {

                if (showMenu){

                    const settings = [{
                        icon: 'eye-slash',
                        iconColor: 'lightyellow',
                        title: 'Unsubscribe from post',
                        description: 'Hide this post and stop receiving notifications.',
                        callback: () => console.log('UNSUBSCRIBED')
                    }];

                    if (!posterIsSelf){
                        settings.push(
                            {
                                icon: 'sign-out',
                                iconColor: 'purple',
                                title: `Unsubscribe from ${ displayName }'s posts`,
                                description: 'Hide all posts from this user and stop receiving notifications.',
                                callback: () => console.log('UNSUBSCRIBED FROM ALL POSTS')
                            },
                            {
                                icon: following ? 'ban' : 'user-plus',
                                iconColor: following ? 'magenta' : 'lightgreen',
                                title: `${ following ? 'Unf' : 'F' }ollow ${ displayName }`,
                                callback: followUser,
                                params: [uid, username, displayName]
                            },
                            {
                                icon: 'user-times',
                                iconColor: 'yellow',
                                title: `Block ${ displayName }`,
                                callback: blockUser,
                                params: [uid]
                            }
                        );
                    }

                    settings.push(
                        {
                            divider: true
                        },
                        {
                            icon: 'flag',
                            iconColor: 'lightorange',
                            title: 'Flag This Post',
                            description: 'Report TOS Violations to the administrators.',
                            callback: () => console.log('FLAGGED!')
                        }
                    );

                    if (posterIsSelf){
                        settings.push(
                            {
                                icon: 'pencil-square-o',
                                iconColor: 'lightgreen',
                                title: 'Edit Your Post',
                                callback: togglePostEditor,
                                params: [postId]
                            },
                            {
                                icon: 'times',
                                highlightColor: 'red',
                                title: 'Delete Your Post',
                                callback: deletePost,
                                params: [postId]
                            }
                        );
                    }

                    return (
                        <div>
                            <SmallMenu
                                width="large"
                                options={ settings }
                                onClose={ this.handlePostMenu } />
                        </div>
                    );
                }

                return '';
            };

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
                    <div className="tonal-post-reply">
                        Post interactions are not currently enabled.
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

            const postMode = () => {
                if (editing){
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
                                <div
                                    ref={ element => this.timeStampRef = element }
                                    className="tonal-post-timestamp">
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
