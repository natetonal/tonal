import React, { Component } from 'react';
import Feed from 'feed/Feed';

class Connect extends Component {

    render(){

        return (
            <div className="connect-container">
                <Feed
                    type="feed"
                    childType="posts" />
            </div>
        );
    }
}

export default Connect;
