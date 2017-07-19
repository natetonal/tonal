import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    TweenLite,
    TimelineLite,
    Power1,
} from 'gsap';

import Composer from 'composer/Composer';
import PreviewLink from 'links/PreviewLink';
import SmallMenu from 'elements/SmallMenu';
import ClickScreen from 'elements/ClickScreen';

import Thread from './Thread';
import Comment from './Comment';
import PostParser from './PostParser';
import PostTimestamp from './PostTimestamp';
import PostInteractionBar from './PostInteractionBar';

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){

        this.setState({
            showMenu: false,
            showReply: false,
            userLikesThisPost: this.props.likesPost(this.props.postId),
            userRepliedToPost: false,
            userSharedThisPost: false,
            likesCount: this.props.data.likesCount || 0,
            sharesCount: this.props.data.sharesCount || 0,
            threadCount: this.props.data.threadCount || 0
        });

        const {
            checkAuthor,
            data,
            feedId,
            postId
        } = this.props;

        checkAuthor(feedId, data, postId);

    },

    componentWillReceiveProps(nextProps){
        // If the user has finished editing the post:
        if (nextProps.editing !== nextProps.postId &&
            this.props.editing === this.props.postId){
            TweenLite.to(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        }
    },

    componentDidUpdate(prevProps){
        // If the user opens the editor:
        if (prevProps.editing !== this.props.postId &&
            this.props.editing === this.props.postId){
            TweenLite.from(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        }

        if (prevProps.data.likesCount !== this.props.data.likesCount &&
            this.props.data.likesCount !== this.state.likesCount){
            this.setState({ likesCount: this.props.data.likesCount });
        }
    },

    handlePostMenu(){
        this.setState({
            showMenu: !this.state.showMenu
        });
    },

    handleLikePost(){
        const {
            likePost,
            postId,
            data
        } = this.props;

        const userLikesThisPost = !this.state.userLikesThisPost;
        const likesCount = userLikesThisPost ? this.state.likesCount + 1 : this.state.likesCount - 1;

        this.setState({
            likesCount,
            userLikesThisPost
        });

        // Animate here.
        likePost(this.props.data.author.uid, postId, data);
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

    handleUpdatePost(updatedPost){

        const {
            updatePost,
            postId
        } = this.props;

        const tl = new TimelineLite();
        tl.to(this.postEditorRef, 0.25, {
            ease: Power1.easeOut,
            transformOrigin: 'top left',
            height: 0,
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', updatePost, [updatedPost, postId]);
    },

    handleTogglePostEditor(){
        const {
            togglePostEditor,
            postId,
            editing
        } = this.props;

        const tl = new TimelineLite();
        if (editing === postId){
            tl.to(this.postEditorRef, 0.25, {
                ease: Power1.easeOut,
                transformOrigin: 'top left',
                height: 0,
                opacity: 0
            });
        }
        tl.play();
        tl.eventCallback('onComplete', togglePostEditor, [postId]);
    },

    handleToggleReply(){
        this.setState({
            showReply: !this.state.showReply
        });
    },

    render(){

        // Post object should be refactored.
        // Author: uid.
        // Unsubscribed:(uid: true)
        // Flagged: 0

        const {
            feedId,
            postId,
            type,
            data,
            editing,
            favorites,
            following,
            posterIsSelf,
            evaluateRelationship,
            deletePost,
            blockUser,
            followUser,
            togglePostEditor
        } = this.props;

        if (data){

            const {
                file,
                type,
                image,
                mentions,
                post,
                raw,
                likes,
                shares,
                postEdited,
                postEditedAt,
                timeStamp,
                thread,
                length,
                author
            } = data;

            const {
                uid,
                avatar,
                displayName,
                username
            } = author;

            const {
                showMenu,
                showReply,
                userLikesThisPost,
                userRepliedToPost,
                userSharedThisPost,
                likesCount,
                sharesCount,
                threadCount
            } = this.state;

            const likeBtn = {
                text: 'Likes',
                type: 'like',
                data: likes,
                icon: 'bolt',
                handler: this.handleLikePost,
                btnState: (userLikesThisPost ? 'active' : ''),
                count: likesCount,
                intro: 'Like'
            };

            const commentBtn = {
                text: 'Replies',
                type: 'reply',
                data: thread,
                icon: 'comment',
                handler: this.handleToggleReply,
                btnState: (userRepliedToPost ? 'active' : ''),
                count: threadCount,
                intro: 'Comment'
            };

            const shareBtn = {
                text: 'Shares',
                type: 'share',
                data: shares,
                icon: 'share',
                handler: () => console.log('Sharing'),
                btnState: (userSharedThisPost ? 'active' : ''),
                count: sharesCount,
                intro: 'Share'
            };

            const renderMenu = () => {

                if (showMenu){

                    const settings = [{
                        icon: 'eye-slash',
                        iconColor: 'midgray',
                        title: 'Hide this post',
                        description: 'This post will no longer show up in your feed.',
                        callback: () => console.log('UNSUBSCRIBED')
                    }];

                    if (!posterIsSelf){

                        if (following){
                            settings.push({
                                icon: favorites ? 'broken-heart' : 'heart',
                                iconColor: favorites ? 'midgray' : 'white',
                                title: favorites ? `Remove ${ displayName } from your favorites` : `Add ${ displayName } to your favorites`,
                                callback: favorites,
                                params: [uid, username, displayName]
                            });
                        }

                        settings.push(
                            {
                                icon: following ? 'user-times' : 'user-plus',
                                iconColor: following ? 'midgray' : 'white',
                                title: `${ following ? 'Unf' : 'F' }ollow ${ displayName }`,
                                callback: followUser,
                                params: [uid, username, displayName]
                            },
                            {
                                icon: 'sign-out',
                                iconColor: 'midgray',
                                title: `Unsubscribe from ${ displayName }'s posts`,
                                description: 'Hide all posts from this user and stop receiving notifications.',
                                callback: () => console.log('UNSUBSCRIBED FROM ALL POSTS')
                            },
                            {
                                divider: true
                            },
                            {
                                icon: 'flag',
                                iconColor: 'white',
                                highlightColor: 'orange',
                                title: 'Flag This Post',
                                description: 'Report TOS Violations to the administrators.',
                                callback: () => console.log('FLAGGED!')
                            },
                            {
                                icon: 'ban',
                                iconColor: 'midgray',
                                highlightColor: 'red',
                                title: `Block ${ displayName }`,
                                callback: blockUser,
                                params: [uid]
                            },
                        );
                    }

                    if (posterIsSelf){
                        settings.push(
                            {
                                divider: true
                            },
                            {
                                icon: 'pencil-square-o',
                                iconColor: 'white',
                                title: 'Edit Your Post',
                                callback: togglePostEditor,
                                params: [postId]
                            },
                            {
                                icon: 'times',
                                iconColor: 'midgray',
                                highlightColor: 'red',
                                title: 'Delete Your Post',
                                callback: deletePost,
                                params: [postId]
                            }
                        );
                    }

                    return (
                        <div>
                            <ClickScreen handleClick={ this.handlePostMenu }>
                                <SmallMenu
                                    width="large"
                                    options={ settings }
                                    onClose={ this.handlePostMenu } />
                            </ClickScreen>
                        </div>
                    );
                }

                return '';
            };

            const renderImage = () => {
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

            const renderBar = () => {
                return (
                    <PostInteractionBar
                        like={ likeBtn }
                        comment={ commentBtn }
                        share={ shareBtn } />
                );
            };

            const postMode = () => {
                if (editing === postId){
                    return (
                        <div
                            ref={ element => this.postEditorRef = element }
                            className="tonal-post-editor">
                            <div
                                className="tonal-post-editor-close"
                                onClick={ this.handleTogglePostEditor }>
                                <i className="fa fa-times" aria-hidden="true" />
                            </div>
                            <Composer
                                initialValue={ raw }
                                mentions={ mentions }
                                type={ type }
                                submitText={ 'Update Your Post ' }
                                onClose={ this.handleTogglePostEditor }
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
                                { renderMenu() }
                            </div>
                            <div
                                ref={ element => this.avatarRef = element }
                                className="tonal-post-avatar">
                                <PreviewLink
                                    key={ `postLink_${ postId }` }
                                    type="user"
                                    previewId={ author.uid }
                                    postId={ postId }
                                    relationship={ evaluateRelationship(author.uid) }
                                    followUser={ followUser }
                                    className="post-mention"
                                    src={ `users/${ author.username }` }>
                                    <img
                                        src={ author.avatar }
                                        alt={ author.displayName }
                                        className="tonal-post-1-avatar-photo" />
                                </PreviewLink>
                            </div>
                            <div className="tonal-post-info">
                                <div
                                    ref={ element => this.displayNameRef = element }
                                    className="tonal-post-display-name">
                                    <PreviewLink
                                        key={ `postLink_${ postId }` }
                                        type="user"
                                        previewId={ author.uid }
                                        postId={ postId }
                                        relationship={ evaluateRelationship(author.uid) }
                                        followUser={ followUser }
                                        className="post-mention"
                                        src={ `users/${ author.username }` }>
                                        { displayName }
                                    </PreviewLink>
                                </div>
                                <PostTimestamp
                                    edited={ postEdited }
                                    editedAt={ postEditedAt }
                                    timeStamp={ timeStamp } />
                            </div>
                        </div>
                        { postMode() }
                        { renderImage() }
                        { renderBar() }
                        <Thread
                            toggleReply={ this.handleToggleReply }
                            showReply={ showReply }
                            data={ thread } />
                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return <div>NO POSTS YET LOL!</div>;
    }
});

export default Post;
