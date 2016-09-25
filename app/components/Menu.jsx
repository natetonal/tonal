import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

export const Menu = React.createClass({

    handleLogout(){
        const { dispatch } = this.props;
        dispatch(actions.logout());
    },

    render(){
        return(
            <nav className="tonal-menu menu-effect" id="menu-2">
                <div className="avatar">
                    <img src="https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954" />
                </div>
                <ul>
                    <li className="special">
                        <Link to="#"><i className="fa fa-cloud-upload" aria-hidden="true"></i>Upload Music</Link>
                    </li>
                    <li><Link to="#">View/Edit Profile</Link></li>
                    <li><Link to="#">Account Settings</Link></li>
                </ul>
                <ul>
                    <li><Link to="#">Tonal FAQ</Link></li>
                    <li><Link to="#">About Us</Link></li>
                    <li><Link to="#">Contact Us</Link></li>
                </ul>
                <ul>
                    <li className="logout">
                        <Link to="#" onClick={ this.handleLogout }>Log Out</Link>
                    </li>
                </ul>
            </nav>
        );
    }
});

export default Redux.connect()(Menu);
