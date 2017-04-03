import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Post from 'post/Post';
import Alert from 'elements/Alert';

// temporary
import moment from 'moment';
// temporary

export const Connect = React.createClass({

    render(){

        const { post } = this.props;

        return (
            <div className="connect-container-2">
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
