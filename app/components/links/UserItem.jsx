import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UserItem extends Component {

    render(){

        if (this.props.user){

            const {
                avatar,
                username,
                displayName
            } = this.props.user;

            return (
                <Link
                    className="user-list-item"
                    to={ `users/${ username }` }>
                    <div className="user-list-avatar">
                        <img
                            src={ avatar }
                            alt={ displayName } />
                    </div>
                    <div className="user-list-display-name">
                        { displayName }
                    </div>
                </Link>
            );
        }

        return <div>Fetching...</div>;
    }
}

export default UserItem;
