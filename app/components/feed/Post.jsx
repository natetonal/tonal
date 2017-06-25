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

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){
        this.setState({
            showMenu: false,
            showTooltip: false,
            showLiked: this.props.likesPost(this.props.postId),
            timeStamp: this.processTimestamp()
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

        this.setState({
            showLiked: !this.state.showLiked
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
                likesCount,
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
                showLiked,
                timeStamp
            } = this.state;

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

            const renderTooltip = (text, icon, handler, btnState = '') => {
                return (
                    <div
                        onMouseEnter={ () => this.setState({ showTooltip: text }) }
                        onMouseLeave={ () => this.setState({ showTooltip: false }) }
                        onClick={ handler }
                        className={ `tonal-post-interaction tonal-post-interaction-${ text.toLowerCase() } ${ btnState }` }>
                        <Tooltip
                            text={ showTooltip === text ? text : false }
                            direction="top"
                            align="center"
                            delay={ 1000 }>
                            <i
                                className={ `fa fa-${ icon }` }
                                aria-hidden="true" />
                        </Tooltip>
                    </div>
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
                                <img
                                    src={ avatar }
                                    alt={ displayName }
                                    className="tonal-post-1-avatar-photo" />
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
                        <div className="tonal-post-interactions">
                            { renderTooltip('Like', 'bolt', this.handleLikePost, (showLiked ? 'liked' : '')) }
                            { renderTooltip('Reply', 'comment', () => console.log('COMMENTING')) }
                            { renderTooltip('Share', 'share', () => console.log('SHARED')) }
                            <div className="tonal-post-interaction tonal-post-interaction-likes">
                                { likesCount } Likes
                            </div>
                        </div>
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
