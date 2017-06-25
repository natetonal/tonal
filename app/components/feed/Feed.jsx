import React from 'react';
import * as Redux from 'react-redux';

import { updateBlockedUser } from 'actions/UserActions';
import { countNewNotifs } from 'actions/NotificationActions';
import { addFollower } from 'actions/FriendshipActions';
import {
    fetchFeed,
    toggleEditPost
} from 'actions/FeedActions';
import {
    likePost,
    deletePost,
    updatePost,
    updatePostAuthorData
} from 'actions/PostActions';

import Post from './Post';

export const Feed = React.createClass({

    componentWillMount(){
        const {
            dispatch,
            uid
        } = this.props;

        if (uid){
            // Fetch the feed:
            dispatch(fetchFeed(uid));
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
        return Object.keys(this.props.feed[postId].likes).includes(this.props.uid);
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
                        Ever.
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

export default Redux.connect(state => {
    return {
        feed: state.feed.data,
        status: state.feed.status,
        editing: state.feed.editing,
        uid: state.auth.uid,
        favorites: state.user.favorites,
        favorited: state.user.favorited,
        followers: state.user.followers,
        following: state.user.following,
        blocked: state.user.blocked,
        blockedBy: state.user.blockedBy
    };
})(Feed);
