import React from 'react';
import UserItem from './UserItem';

export const UserList = React.createClass({

    render(){

        if (this.props.users){

            const {
                onMouseEnter,
                onMouseLeave,
                users
            } = this.props;

            if (users){
                const renderList = () => {
                    return users.map(user => {
                        return (
                            <UserItem
                                key={ `UserPreviewItem_${ user.uid }` }
                                user={ user } />
                        );
                    });
                };

                return (
                    <div
                        className="user-list"
                        onMouseEnter={ onMouseEnter() }
                        onMouseLeave={ onMouseLeave() }>
                        { renderList() }
                    </div>
                );
            }

            return (
                <div
                    className="user-list"
                    onMouseEnter={ onMouseEnter() }
                    onMouseLeave={ onMouseLeave() }>
                    NOTHING TO SEE HERE.
                </div>
            );
        }
    }

});

export default UserList;
