import React from 'react';
import * as Redux from 'react-redux';

import Post from 'post/Post';


export const Connect = React.createClass({

    render(){

        const { post } = this.props;

        return (
            <div className="connect-container">
                <Post data={ post } />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        post: state.headerCompose.post
    };
})(Connect);
