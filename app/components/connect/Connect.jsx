import React from 'react';
import * as Redux from 'react-redux';
import firebase from 'firebase';
import {
    fetchFeed,
    addFeedPost,
    removeFeedPost
} from 'actions/FeedActions';
import Post from 'post/Post';


export const Connect = React.createClass({

    componentWillMount(){
        const {
            dispatch,
            uid
        } = this.props;
        if (uid){
            // Fetch the feed:
            dispatch(fetchFeed(uid));

            // Set up observers for it:
            const feedRef = firebase.database().ref(`/feed/${ uid }/`);
            feedRef.on('child_added', post => {
                dispatch(addFeedPost(post.key, post.val()));
            });
            feedRef.on('child_changed', post => {
                console.log('child changed!');
                dispatch(addFeedPost(post.key, post.val()));
            });
            feedRef.on('child_removed', post => {
                console.log('POST DELETION WITNESSED! REMOVING: ', post.key);
                dispatch(removeFeedPost(post.key));
            });

        }
    },

    render(){

        const {
            feed,
            status,
            uid
        } = this.props;

        console.log('uid? ', uid);

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
                        return (
                            <Post
                                feedId={ uid }
                                key={ key }
                                data={ feed[key] } />
                        );
                    });
                }

                return '';
            }

            return 'no idea what happen, mang.';
        };

        return (
            <div className="connect-container">
                { renderFeed() }
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        feed: state.feed.data,
        status: state.feed.status,
        uid: state.auth.uid
    };
})(Connect);
