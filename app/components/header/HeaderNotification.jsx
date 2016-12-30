import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const HeaderNotification = React.createClass({

    componentWillMount(){
        this.setState({
            showNotifMenu: false
        });
    },

    toggleNotifMenu(){
        this.setState({
            showNotifMenu: !this.state.showNotifMenu
        });
    },

    render(){

        const { data: { type, received, displayName, avatarPhoto, timeStamp}} = this.props;
        const { showNotifMenu } = this.state;

        return(
            <div className={`header-notification${ received ? ' received' : '' }`}>
                <div className="header-notification-img">
                    <img src={ avatarPhoto } />
                </div>
                <div onMouseEnter={ this.toggleNotifMenu }
                     onMouseLeave={ this.toggleNotifMenu }
                     className="header-notification-content">
                    { showNotifMenu && (
                    <div className="header-notification-settings">
                        <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </div>
                    )}
                    <div className="header-notification-message">
                        <p>
                            <span className="header-notification-message-link">{ displayName }</span> commented on your  <span className="header-notification-message-link">post.</span>
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

export default Redux.connect(state => {
    return {

    };
})(HeaderNotification);
