import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const HeaderNotification = React.createClass({

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
        console.log('HeaderNotification.jsx: Unfollow user action selected.');
    },

    handleBlock(event){
        event.preventDefault();
        console.log('HeaderNotification.jsx: Block user action selected.');
    },

    render(){

        const { data: { type, received, displayName, avatarPhoto, timeStamp}} = this.props;
        const { showNotifMenuIcon, showNotifMenu } = this.state;

        return(
            <div className={`header-notification${ received ? ' received' : '' }`}>
                <div className="header-notification-img">
                    <img src={ avatarPhoto } />
                </div>
                <div onMouseEnter={ this.toggleNotifMenuIcon }
                     onMouseLeave={ this.toggleNotifMenuIcon }
                     className="header-notification-content">
                        <div onClick={ this.toggleNotifMenu } className="header-notification-settings">
                            { showNotifMenuIcon && <i className="fa fa-angle-down" aria-hidden="true"></i> }
                            { showNotifMenuIcon && showNotifMenu &&  (
                                <div onMouseLeave={ this.toggleNotifMenu } className="header-notification-menu">
                                    <div className="header-notification-menu-option"
                                         onClick={ this.handleUnfollow }>
                                            <i className="fa fa-ban" aria-hidden="true"></i>
                                            Unfollow <strong>{ displayName }</strong>
                                    </div>
                                    <div className="header-notification-menu-option"
                                         onClick={ this.handleBlock }>
                                            <i className="fa fa-user-times" aria-hidden="true"></i>
                                            Block <strong>{ displayName }</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    <div className="header-notification-message">
                        <p>
                            <span className="header-notification-message-link">{ displayName }</span> commented on commented on your commented on your commented on your commented on your commented on your  <span className="header-notification-message-link">post.</span>
                        </p>
                    </div>
                    <div className="header-notification-timestamp">
                        { timeStamp }
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect()(HeaderNotification);
