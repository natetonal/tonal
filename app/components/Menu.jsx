import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import { startLogout } from 'actions/AuthActions';

import numeral from 'numeral';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

export const Menu = React.createClass({

    handleLogout(){
        const { dispatch } = this.props;
        dispatch(startLogout());
    },

    render(){

        const {
            avatar,
            displayName,
            followers,
            following
        } = this.props;

        const formatNumber = num => {
            if (num.toString().length > 5){
                return numeral(num).format('0a');
            }

            return numeral(num).format('0,0');
        };

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

        const displayNameClassName = () => {
            const avatarClass = 'avatar-display-name';

            if (displayName.length > 14 &&
                displayName.length <= 22) {
                return `${ avatarClass } med`;
            } else if (displayName.length > 22){
                return `${ avatarClass } sm`;
            }

            return avatarClass;
        };

        console.log('display name class: ', displayNameClassName());
        return (
            <nav className="tonal-menu menu-effect" id="menu-2">
                <div className="avatar">
                    { av() }
                    <div className="avatar-overlay">
                        <div className="avatar-content">
                            <div className={ displayNameClassName() }>
                                { displayName }
                            </div>
                            <div className="avatar-stats">
                                <div className="avatar-followers">
                                    <div className="avatar-followers-label">
                                        Followers
                                    </div>
                                    <div className="avatar-followers-count">
                                        { formatNumber(followers) }
                                    </div>
                                </div>
                                <div className="avatar-following">
                                    <div className="avatar-following-label">
                                        Following
                                    </div>
                                    <div className="avatar-following-count">
                                        { formatNumber(following) }
                                    </div>
                                </div>
                            </div>
                        </div>
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
        email: state.user.email,
        followers: state.user.followers,
        following: state.user.following
    };
})(Menu);
