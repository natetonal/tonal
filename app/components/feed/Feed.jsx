import React from 'react';
import * as Redux from 'react-redux';
import firebase from 'firebase';

import {
    syncUserData,
    updateBlockedUser
} from 'actions/UserActions';
import { countNewNotifs } from 'actions/NotificationActions';
import { addFollower } from 'actions/FriendshipActions';
import {
    fetchFeed,
    addFeedPost,
    updateFeedPost,
    removeFeedPost,
    toggleEditPost
} from 'actions/FeedsActions';
import {
    likePost,
    deletePost,
    updatePost,
    updatePostAuthorData
} from 'actions/PostActions';

import Post from './Post';

export const Feed = React.createClass({

    componentWillMount(){

        console.log('Mounting feed.');
        const {
            dispatch,
            feedId,
            type,
            uid
        } = this.props;

        if ((feedId || uid) && type){

            this.fId = feedId || uid;
            // Fetch the feed:
            dispatch(fetchFeed(this.fId, type));

            // Mount observers:
            const feedRef = firebase.database().ref(`${ type }/${ this.fId }/`);
            feedRef.on('child_added', post => {
                dispatch(addFeedPost(this.fId, post.key, post.val()));
                console.log('from feed: child added: ', post.val());
                dispatch(syncUserData(['postCount']));
            });
            feedRef.on('child_changed', post => {
                dispatch(updateFeedPost(this.fId, post.key, post.val()));
                console.log('from feed: child changed: ', post.val());
            });
            feedRef.on('child_removed', post => {
                dispatch(removeFeedPost(this.fId, post.key));
                dispatch(syncUserData(['postCount']));
            });
        }
    },

    handleFollowUser(followedUid, username, displayName){
        const { dispatch } = this.props;
        if (!this.isBlocked(followedUid)){
            dispatch(addFollower(followedUid, username, displayName));
        }
    },

    handleBlockUser(blockedUid){
        const { dispatch } = this.props;
        dispatch(updateBlockedUser(blockedUid))
        .then(() => {
            dispatch(countNewNotifs());
        });
    },

    handleUpdatePost(updatedPost, postId){
        const { dispatch } = this.props;
        dispatch(updatePost(updatedPost, postId));
    },

    handleLikePost(authorId, postId){
        const {
            dispatch,
            uid
        } = this.props;

        console.log('handleLikePost called with ', postId);
        const liked = !this.likesPost(postId, uid);
        console.log('handleLikePost valued of liked ', liked);
        dispatch(likePost(authorId, postId, uid, liked));
    },

    handleDeletePost(notifId){
        const { dispatch } = this.props;
        console.log('delete this notif: ', notifId);
        dispatch(deletePost(notifId));
    },

    togglePostEditor(postId = false){
        console.log('togglePostEditor called with id: ', postId);
        const { dispatch } = this.props;
        dispatch(toggleEditPost(postId));
    },

    isSelf(testUid){
        return testUid === this.props.uid;
    },

    likesPost(postId){
        const postLikes = this.props.feed[postId].likes || {};
        return Object.keys(postLikes).includes(this.props.uid);
    },

    checkFriendship(testUid, testGroup){
        const group = this.props[testGroup] || {};
        return Object.keys(group).includes(testUid);
    },

    checkAuthor(data, postId){
        const { dispatch } = this.props;
        dispatch(updatePostAuthorData(data, postId));
    },

    evaluateRelationship(testUid){

        if (this.isSelf(testUid)){ return 'self'; }

        return ['blocked', 'blockedBy', 'favorites', 'following'].find(group => {
            return this.checkFriendship(testUid, group);
        }) || 'none';
    },

    render(){

        const {
            feed,
            type,
            status,
            uid,
            editing,
            favorites,
            following,
            blocked,
            blockedBy
        } = this.props;

        const renderFeed = () => {
            if (status === 'fetching' || !status){
                return <div>Fetching...</div>;
            } else if (status === 'error'){
                return <div>Error.</div>;
            } else if (status === 'success'){
                if (feed){
                    return Object.keys(feed)
                    .reverse()
                    .map(key => {

                        const status = feed[key].status;
                        const isFollowing = this.checkFriendship(feed[key].author.uid, 'following');
                        const isBlocked = this.checkFriendship(feed[key].author.uid, 'blocked');
                        const isBlockedBy = this.checkFriendship(feed[key].author.uid, 'blockedBy');
                        const posterIsSelf = this.isSelf(feed[key].author.uid);

                        if (!isBlocked &&
                            !isBlockedBy &&
                            (isFollowing || posterIsSelf)){
                            // Need to add post type
                            // Need to simplify post object.
                            // Need to add text snippet.
                            // const notifType = feed[key].type;

                            return (
                                <Post
                                    key={ `post_${ key }` }
                                    feedId={ uid }
                                    postId={ key }
                                    status={ status }
                                    data={ feed[key] }
                                    editing={ editing }
                                    favorites={ favorites }
                                    following={ following }
                                    blocked={ blocked }
                                    blockedBy={ blockedBy }
                                    posterIsSelf={ posterIsSelf }
                                    checkAuthor={ this.checkAuthor }
                                    checkFriendship={ this.checkFriendship }
                                    evaluateRelationship={ this.evaluateRelationship }
                                    isSelf={ this.isSelf }
                                    likesPost={ this.likesPost }
                                    updatePost={ this.handleUpdatePost }
                                    deletePost={ this.handleDeletePost }
                                    likePost={ this.handleLikePost }
                                    blockUser={ this.handleBlockUser }
                                    followUser={ this.handleFollowUser }
                                    togglePostEditor={ this.togglePostEditor } />
                            );
                        }

                        return '';
                    });
                }

                return (
                    <div className="feed-nofeed">
                        Nothing to show here. <br />
                        This should never, ever be visible once Tonal is live. <br />
                        Ever. <br /><br />
                        - Love, Nate
                    </div>
                );
            }

            return 'no idea what happen, mang.';
        };

        return (
            <div>
                { renderFeed() }
            </div>
        );
    }

});

export default Redux.connect((state, ownProps) => {
    const feedId = ownProps.feedId || state.auth.uid;
    const feed = ((state.feeds && state.feeds.feeds[feedId]) ? state.feeds.feeds[feedId].data : false);
    const status = ((state.feeds && state.feeds.feeds[feedId]) ? state.feeds.feeds[feedId].status : false);

    return {
        feed,
        status,
        editing: state.feeds.editing,
        uid: state.auth.uid,
        favorites: state.user.favorites,
        favorited: state.user.favorited,
        followers: state.user.followers,
        following: state.user.following,
        blocked: state.user.blocked,
        blockedBy: state.user.blockedBy
    };
})(Feed);
