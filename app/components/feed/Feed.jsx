import React from 'react';
import * as Redux from 'react-redux';

import { updateBlockedUser } from 'actions/UserActions';
import { countNewNotifs } from 'actions/NotificationActions';
import { addFollower } from 'actions/FollowActions';
import {
    fetchFeed,
    toggleEditPost
} from 'actions/FeedActions';
import {
    deletePost,
    updatePost
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

    handleDeletePost(notifId){
        const { dispatch } = this.props;
        console.log('delete this notif: ', notifId);
        dispatch(deletePost(notifId));
    },

    togglePostEditor(postId){
        const { dispatch } = this.props;
        dispatch(toggleEditPost(postId));
    },

    isEditing(testPostId){
        const { editing } = this.props;
        return editing === testPostId;
    },

    isSelf(testUid){
        return testUid === this.props.uid;
    },

    isBlocked(testUid){
        const blocked = this.props.blocked || {};
        return Object.keys(blocked).includes(testUid);
    },

    isFollowing(testUid){
        const following = this.props.following || {};
        return Object.keys(following).includes(testUid);
    },

    isBlockedBy(testUid){
        const blockedBy = this.props.blockedBy || {};
        return Object.keys(blockedBy).includes(testUid);
    },

    render(){

        const {
            feed,
            status,
            uid
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

                        const following = this.isFollowing(feed[key].user.uid);
                        const blocked = this.isBlocked(feed[key].user.uid);
                        const blockedBy = this.isBlockedBy(feed[key].user.uid);
                        const posterIsSelf = this.isSelf(feed[key].user.uid);
                        const editing = this.isEditing(key);

                        if (!blocked &&
                            !blockedBy &&
                            (following || posterIsSelf)){
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
                                    following={ following }
                                    blocked={ blocked }
                                    blockedBy={ blockedBy }
                                    posterIsSelf={ posterIsSelf }
                                    isFollowing={ this.isFollowing }
                                    isBlocked={ this.isBlocked }
                                    isBlockedBy={ this.isBlockedBy }
                                    isSelf={ this.isSelf }
                                    updatePost={ this.handleUpdatePost }
                                    deletePost={ this.handleDeletePost }
                                    blockUser={ this.handleBlockUser }
                                    followUser={ this.handleFollowUser }
                                    togglePostEditor={ this.togglePostEditor } />
                            );
                        }

                        return '';
                    });
                }

                return '';
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
        followers: state.user.followers,
        following: state.user.following,
        blocked: state.user.blocked,
        blockedBy: state.user.blockedBy
    };
})(Feed);
