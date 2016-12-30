import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import onClickOutside from 'react-onclickoutside';

export const HeaderNotificationMenu = onClickOutside(React.createClass({

    componentWillMount(){
        this.setState({
            isNotifsMenuOpen: true
        });
    },

    handleClickOutside(event){
        event.preventDefault();
        this.setState({
            isNotifsMenuOpen: false
        });
    },

    render(){
        return(
            <div className="header-notification-menu">
                <div className="header-notifiaction-menu-option"></div>
                <div className="header-notifiaction-menu-option"></div>
            </div>
        );
    }
}));

export default Redux.connect(state => {
    return {

    };
})(HeaderNotificationMenu);
