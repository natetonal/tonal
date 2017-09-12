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
import PostImage from './PostImage';
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
            checkImage,
            data,
            postId
        } = this.props;

        checkAuthor(data, postId);
        checkImage(data, postId);

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
            TweenLite.fromTo(this.postEditorRef, 0.75,
                {
                    height: 0,
                    opacity: 0
                },
                {
                    ease: Power1.easeOut,
                    height: '100%',
                    opacity: 1
                });
        }

        if (prevProps.data.likesCount !== this.props.data.likesCount &&
            this.props.data.likesCount !== this.state.likesCount){
            this.setState({ likesCount: this.props.data.likesCount });
        }
    },

    handlePostMenu(){
        this.setState({ showMenu: !this.state.showMenu });
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

        console.log('updatedPost received by handleUpdatePost: ', updatedPost);

        const tl = new TimelineLite();
        tl.to(this.postEditorRef, 0.25, {
            ease: Power1.easeOut,
            transformOrigin: 'top left',
            height: 0,
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', this.handleUpdatePostCallback, [updatedPost]);
    },

    handleUpdatePostCallback(updatedPost){
        const {
            updatePost,
            postId
        } = this.props;

        updatePost(updatedPost, postId);

    },

    handleTogglePostEditor(){
        console.log('from post:  togglePostEditor called');
        // an edit.
        const {
            togglePostEditor,
            postId,
            editing
        } = this.props;

        console.log('handleTogglePostEditor called. Editor currently open? ', editing === postId);
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
            postId,
            data,
            editing,
            favorites,
            following,
            screenSize,
            posterIsSelf,
            evaluateRelationship,
            deletePost,
            blockUser,
            followUser,
            favoriteUser,
            togglePostEditor
        } = this.props;

        if (data){

            const {
                showMenu,
                showReply,
                imageLoaded,
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
                data: data.likes,
                icon: 'bolt',
                handler: this.handleLikePost,
                btnState: (userLikesThisPost ? 'active' : ''),
                count: likesCount,
                intro: 'Like'
            };

            const commentBtn = {
                text: 'Replies',
                type: 'reply',
                data: data.thread,
                icon: 'comment',
                handler: this.handleToggleReply,
                btnState: (userRepliedToPost ? 'active' : ''),
                count: threadCount,
                intro: 'Comment'
            };

            const shareBtn = {
                text: 'Shares',
                type: 'share',
                data: data.shares,
                icon: 'share',
                btnState: (userSharedThisPost ? 'active' : ''),
                count: sharesCount,
                intro: 'Share'
            };

            const renderMenu = () => {

                if (showMenu){

                    const { uid, username, displayName } = data.author;
                    const settings = [{
                        icon: 'eye-slash',
                        iconColor: 'midgray',
                        title: 'Hide this post',
                        description: 'This post will no longer show up in your feed.',
                    }];

                    if (!posterIsSelf){

                        if (following){
                            settings.push({
                                icon: favorites ? 'broken-heart' : 'heart',
                                iconColor: favorites ? 'midgray' : 'white',
                                title: favorites ? `Remove ${ displayName } from your favorites` : `Add ${ displayName } to your favorites`,
                                callback: favoriteUser,
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
                if (data.image){

                    return (
                        <PostImage
                            file={ data.file }
                            image={ data.image }
                            screenSize={ screenSize }
                            onClick={ () => console.log('IMAGE CLICKED!') } />
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
                                prevData={ data }
                                initialValue={ data.raw }
                                mentions={ data.mentions }
                                type={ data.type }
                                submitText={ 'Update Your Post ' }
                                onSubmit={ this.handleUpdatePostCallback } />
                        </div>
                    );
                }

                return (
                    <PostParser
                        post={ data.post }
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
                                    previewId={ data.author.uid }
                                    postId={ data.postId }
                                    relationship={ evaluateRelationship(data.author.uid) }
                                    followUser={ data.followUser }
                                    className="post-mention"
                                    src={ `users/${ data.author.username }` }>
                                    <img
                                        src={ data.author.avatar }
                                        alt={ data.author.displayName }
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
                                        previewId={ data.author.uid }
                                        postId={ postId }
                                        relationship={ evaluateRelationship(data.author.uid) }
                                        followUser={ followUser }
                                        className="post-mention"
                                        src={ `users/${ data.author.username }` }>
                                        { data.author.displayName }
                                    </PreviewLink>
                                </div>
                                <PostTimestamp
                                    edited={ data.postEdited }
                                    editedAt={ data.postEditedAt }
                                    timeStamp={ data.timeStamp } />
                            </div>
                        </div>
                        { postMode() }
                        { renderImage() }
                        { renderBar() }
                        <Thread
                            toggleReply={ this.handleToggleReply }
                            showReply={ showReply }
                            author={ data.author}
                            data={ data.thread } />
                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return <div>NO POSTS YET LOL!</div>;
    }
});

export default Post;
