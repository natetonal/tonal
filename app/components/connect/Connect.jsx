import React from 'react';
import * as Redux from 'react-redux';
import firebase from 'firebase';
import {
    fetchFeed,
    addFeedPost
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
                console.log('post added to DB. adding to state.', post.val());
                dispatch(addFeedPost(post.key, post.val()));
            });
        }
    },

    render(){

        const {
            feed,
            status
        } = this.props;

        console.log('Connect / feed? ', feed);
        const renderFeed = () => {
            if (status === 'fetching'){
                return <div>Fetching...</div>;
            } else if (status === 'error'){
                return <div>Error.</div>;
            } else if (status === 'success'){
                console.log('Connect / success!');
                if (feed){
                    console.log('Connect / there is a feed. mapping now.', feed);
                    console.log('Object.keys(feed): ', Object.keys(feed).reverse());
                    return Object.keys(feed)
                    .reverse()
                    .map(key => {
                        console.log('Connect / post in this map: ', feed[key]);
                        return (
                            <Post
                                key={ key }
                                data={ feed[key] } />
                        );
                    });
                }

                return 'no feed mang.';
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
