import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';
import {
    TweenLite,
    TimelineLite,
    Power1,
} from 'gsap';

import Composer from 'composer/Composer';
import PreviewLink from 'links/PreviewLink';
import SmallMenu from 'elements/SmallMenu';
import ClickScreen from 'elements/ClickScreen';
import Tooltip from 'elements/Tooltip';

import Comment from './Comment';
import PostParser from './PostParser';
import PostInteractionBar from './PostInteractionBar';

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){
        this.setState({
            showMenu: false,
            showTooltip: false,
            userLikesThisPost: this.props.likesPost(this.props.postId),
            userRepliedToPost: false,
            userSharedThisPost: false,
            timeStamp: this.processTimestamp(),
            likesCount: this.props.data.likesCount || 0,
            sharesCount: this.props.data.sharesCount || 0,
            theadCount: this.props.data.threadCount || 0
        });

        const {
            checkAuthor,
            data,
            postId
        } = this.props;

        checkAuthor(data, postId);
    },

    componentDidMount(){
        this.interval = setInterval(this.updateTimestamp, 1000);
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

        if (nextProps.data.likesCount !== this.state.likesCount){
            this.setState({ likesCount: nextProps.data.likesCount });
        }
    },

    componentDidUpdate(prevProps, prevState){
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

        if (prevState.timeStamp !== this.state.timeStamp){
            TweenLite.from(this.timeStampRef, 0.5, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    },

    componentWillUnmount(){
        clearInterval(this.interval);
    },

    processTimestamp(){
        const timeStamp = this.props.data.postEditedAt || this.props.data.timeStamp;
        const sameOrBefore = moment().subtract(3, 'days').isSameOrBefore(moment(timeStamp, 'LLLL'));
        if (sameOrBefore){
            return moment(timeStamp, 'LLLL').fromNow();
        }

        return timeStamp;
    },

    updateTimestamp(){
        this.setState({
            timeStamp: this.processTimestamp()
        });
    },

    handlePostMenu(){
        this.setState({
            showMenu: !this.state.showMenu
        });
    },

    handleLikePost(){
        const {
            likePost,
            postId
        } = this.props;

        const userLikesThisPost = !this.state.userLikesThisPost;
        const likesCount = userLikesThisPost ? this.state.likesCount + 1 : this.state.likesCount - 1;

        this.setState({
            likesCount,
            userLikesThisPost
        });

        // Animate here.
        likePost(this.props.data.author.uid, postId);
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
            favorites,
            following,
            blocked,
            blockedBy,
            posterIsSelf,
            checkFriendship,
            evaluateRelationship,
            isSelf,
            deletePost,
            updatePost,
            likePost,
            blockUser,
            followUser,
            togglePostEditor
        } = this.props;

        if (data){

            const {
                file,
                image,
                mentions,
                post,
                raw,
                likes,
                shares,
                postEdited,
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
                showTooltip,
                userLikesThisPost,
                userRepliedToPost,
                userSharedThisPost,
                timeStamp,
                likesCount,
                sharesCount,
                threadCount
            } = this.state;

            const intBtns = [
                {
                    text: 'Likes',
                    data: likes,
                    icon: 'bolt',
                    handler: this.handleLikePost,
                    btnState: (userLikesThisPost ? 'active' : ''),
                    count: likesCount
                },
                {
                    text: 'Replies',
                    data: thread,
                    icon: 'comment',
                    handler: () => console.log('Commenting'),
                    btnState: (userRepliedToPost ? 'active' : ''),
                    count: threadCount
                },
                {
                    text: 'Shares',
                    data: shares,
                    icon: 'share',
                    handler: () => console.log('Sharing'),
                    btnState: (userSharedThisPost ? 'active' : ''),
                    count: sharesCount
                }
            ];

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
                            <ClickScreen onClick={ this.handlePostMenu }>
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

            const renderThread = () => {

                if (thread){
                    return Object.keys(thread).map((key) => {
                        const d = thread[key];
                        return (
                            <Comment
                                key={ `comment_${ key }` }
                                data={ d }
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

            const renderTimestamp = () => {
                if (postEdited){
                    return `Edited ${ timeStamp }`;
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
                                <div
                                    ref={ element => this.timeStampRef = element }
                                    className="tonal-post-timestamp">
                                    { renderTimestamp() }
                                </div>
                            </div>
                        </div>
                        { postMode() }
                        { renderImage() }
                        <PostInteractionBar buttons={ intBtns } />
                        <div className="tonal-post-thread">
                            { renderThread() }
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return <div>NO POSTS YET LOL!</div>;
    }
});

export default Post;
