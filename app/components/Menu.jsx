import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import { startLogout } from 'actions/AuthActions';
import {
    TweenLite,
    Power2,
    Back
} from 'gsap';
import numeral from 'numeral';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

export const Menu = React.createClass({

    componentWillUpdate(nextProps){
        if (!this.props.menuIsOpen && nextProps.menuIsOpen){
            TweenLite.from(this.namesRef, 0.75, {
                ease: Power2.easeOut,
                opacity: 0
            });
            TweenLite.from(this.statsRef, 0.75, {
                ease: Back.easeOut.config(2),
                opacity: 0,
                height: 0
            }, '-=0.5');
        }
    },

    handleLogout(){
        const { dispatch } = this.props;
        dispatch(startLogout());
    },

    render(){

        const {
            avatar,
            displayName,
            username,
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

        return (
            <nav className="tonal-menu menu-effect" id="menu-2">
                <div className="avatar">
                    { av() }
                    <div className="avatar-overlay">
                        <div className="avatar-content">
                            <div
                                className="avatar-names"
                                ref={ element => this.namesRef = element }>
                                <div className={ displayNameClassName() }>
                                    { displayName }
                                </div>
                                <div className="avatar-username">
                                    { `@${ username }` }
                                </div>
                            </div>
                            <div
                                className="avatar-stats"
                                ref={ element => this.statsRef = element }>
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
        username: state.user.username,
        email: state.user.email,
        followers: state.user.followerCount,
        following: state.user.followingCount,
        menuIsOpen: state.uiState.menuIsOpen
    };
})(Menu);
