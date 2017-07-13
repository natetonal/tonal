import React from 'react';
import Feed from 'feed/Feed';

export const Connect = React.createClass({

    render(){

        return (
            <div className="connect-container">
                <Feed
                    type="feed"
                    childType="posts" />
            </div>
        );
    }
});

export default Connect;
