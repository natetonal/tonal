import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startLogout } from 'actions/AuthActions';
import {
    TweenLite,
    TimelineLite,
    Power2,
    Back
} from 'gsap';
import numeral from 'numeral';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

class Menu extends Component {

    componentWillUpdate = nextProps => {
        if (this.props.headerMenu !== nextProps.headerMenu &&
            nextProps.headerMenu === 'settings'){
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

        // For each counter, animate change:
        ['followers', 'following'].forEach(group => {
            if (this.props[group] !== nextProps[group]){
                const counterTL = new TimelineLite();
                counterTL.from(this[`${ group }CountRef`], 1, {
                    ease: Power2.easeOut,
                    y: 10
                });
                counterTL.from(this[`${ group }CountRef`], 1, {
                    ease: Power2.easeIn,
                    color: this.props[group] < nextProps[group] ? '#3ef669' : '#e30713'
                });
                counterTL.play();
            }
        });
    }

    handleLogout = () => {
        const { dispatch } = this.props;
        dispatch(startLogout());
    }

    render(){

        const {
            avatar,
            displayName,
            username,
            followers,
            following,
            favorites,
            favorited
        } = this.props;

        const formatNumber = num => {
            if (!num) { return 0; }

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
                                <div className="avatar-friendship">
                                    <div className="avatar-friendship-label">
                                        Followers
                                    </div>
                                    <div
                                        ref={ element => this.followersCountRef = element }
                                        className="avatar-friendship-count">
                                        { formatNumber(followers) }
                                    </div>
                                </div>
                                <div className="avatar-friendship">
                                    <div className="avatar-friendship-label">
                                        Following
                                    </div>
                                    <div
                                        ref={ element => this.followingCountRef = element }
                                        className="avatar-friendship-count">
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
}

export default connect(state => {
    return {
        avatar: state.user.avatar,
        displayName: state.user.displayName,
        username: state.user.username,
        email: state.user.email,
        followers: state.user.followersCount,
        following: state.user.followingCount,
        favorites: state.user.favoritesCount,
        favorited: state.user.favoritedCount,
        headerMenu: state.uiState.headerMenu
    };
})(Menu);
