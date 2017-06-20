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
import Comment from './Comment';
import PostParser from './PostParser';

const bigTextLength = 80;

export const Post = React.createClass({

    componentWillMount(){
        this.setState({
            showMenu: false,
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
                timeStamp
            } = this.state;

            const displayMenu = () => {

                if (showMenu){

                    const settings = [{
                        icon: 'eye-slash',
                        iconColor: 'midgray',
                        title: 'Hide this post',
                        description: 'This post will no longer show up in your feed.',
                        callback: () => console.log('UNSUBSCRIBED')
                    }];

                    if (!posterIsSelf){
                        settings.push(
                            {
                                icon: 'sign-out',
                                iconColor: 'midgray',
                                title: `Unsubscribe from ${ displayName }'s posts`,
                                description: 'Hide all posts from this user and stop receiving notifications.',
                                callback: () => console.log('UNSUBSCRIBED FROM ALL POSTS')
                            },
                            {
                                icon: following ? 'user-times' : 'user-plus',
                                iconColor: following ? 'midgray' : 'white',
                                title: `${ following ? 'Unf' : 'F' }ollow ${ displayName }`,
                                callback: followUser,
                                params: [uid, username, displayName]
                            },
                            {
                                divider: true
                            },
                            {
                                icon: 'flag',
                                iconColor: 'white',
                                highlightColor: 'darkorange',
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

            const displayTimestamp = () => {
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
                                { displayMenu() }
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

export default Post;
