import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import { startLogout } from 'actions/AuthActions';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

export const Menu = React.createClass({

    handleLogout(){
        const { dispatch } = this.props;
        dispatch(startLogout());
    },

    render(){

        const {
            avatar,
            displayName
        } = this.props;

        const av = () => {
            if (avatar){
                return (
                    <img
                        src={ avatar }
                        alt={ displayName } />
                );
            }

            return (
                <img
                    src={ dummyPhoto }
                    alt={ displayName } />
            );
        };

        return (
            <nav className="tonal-menu menu-effect" id="menu-2">
                <div className="avatar">
                    { av() }
                    <div className="avatar-overlay">
                        {
                            displayName &&
                            <h5>{ displayName }</h5>
                        }
                    </div>
                </div>
                <ul>
                    <li className="special">
                        <Link to="#">
                            <i className="fa fa-cloud-upload" aria-hidden="true" />Upload Music
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            View/Edit Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            Account Settings
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to="#">
                            Tonal FAQ
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            Contact Us
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li className="logout">
                        <Link
                            to="#"
                            onClick={ this.handleLogout }>
                            Log Out
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
});

export default Redux.connect(state => {
    return {
        avatar: state.user.avatar,
        displayName: state.user.displayName,
        email: state.user.email
    };
})(Menu);
