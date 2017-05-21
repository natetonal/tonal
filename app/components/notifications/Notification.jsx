import React from 'react';
import { Link } from 'react-router';

export const Notification = React.createClass({

    componentWillMount(){
        this.setState({
            showNotifMenuIcon: false,
            showNotifMenu: false
        });
    },

    toggleNotifMenuIcon(event){
        event.preventDefault();
        this.setState({
            showNotifMenuIcon: !this.state.showNotifMenuIcon
        });
    },

    toggleNotifMenu(event){
        event.preventDefault();
        this.setState({
            showNotifMenu: !this.state.showNotifMenu
        });
    },

    handleUnfollow(event){
        event.preventDefault();
    },

    handleBlock(event){
        event.preventDefault();
    },

    render(){

        const {
            unfollowUser,
            blockUser,
            deleteNotif,
            notifId,
            data: {
                type,
                uid,
                username,
                displayName,
                avatar,
                timeStamp,
                acknowledged
            }
        } = this.props;

        const {
            showNotifMenuIcon,
            showNotifMenu
        } = this.state;

        console.log('data? ', this.props.data);
        console.log('uid? ', uid);
        const renderNotifMessage = () => {
            switch (type){
                case 'follower-add':
                    return (
                        <div className="header-notification-message">
                            <p>
                                <Link
                                    ref={ element => this.previewElement = element }
                                    className="header-notification-message-link"
                                    to={ `users/${ username }` }>
                                    { displayName }
                                </Link>
                                { ' started following you.' }
                            </p>
                        </div>
                    );
                default:
                    return '';
            }
        };

        return (
            <div className={ `header-notification${ acknowledged ? ' received' : '' }` }>
                <div className="header-notification-img">
                    <img
                        src={ avatar }
                        alt={ displayName } />
                </div>
                <div
                    onMouseEnter={ this.toggleNotifMenuIcon }
                    onMouseLeave={ this.toggleNotifMenuIcon }
                    className="header-notification-content">
                    <div
                        onClick={ this.toggleNotifMenu }
                        className="header-notification-settings">
                        { showNotifMenuIcon && <i className="fa fa-angle-down" aria-hidden="true" /> }
                        { showNotifMenuIcon && showNotifMenu && (
                            <div
                                onMouseLeave={ this.toggleNotifMenu }
                                className="header-notification-menu">
                                <div
                                    className="header-notification-menu-option"
                                    onClick={ e => unfollowUser(uid, e) }>
                                    <i
                                        className="fa fa-ban"
                                        aria-hidden="true" />
                                        Unfollow <strong>{ displayName }</strong>
                                </div>
                                <div
                                    className="header-notification-menu-option"
                                    onClick={ e => blockUser(uid, e) }>
                                    <i className="fa fa-user-times" aria-hidden="true" />
                                    Block <strong>{ displayName }</strong>
                                </div>
                                <div
                                    className="header-notification-menu-option"
                                    onClick={ e => deleteNotif(notifId, e) }>
                                    <i className="fa fa-times" aria-hidden="true" />
                                    Delete Notification
                                </div>
                            </div>
                        )}
                    </div>
                    { renderNotifMessage() }
                    <div className="header-notification-timestamp">
                        { timeStamp }
                    </div>
                </div>
            </div>
        );
    }
});

export default Notification;
