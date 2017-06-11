import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
    TimelineLite,
    Power1
} from 'gsap';

import ClickScreen from 'elements/ClickScreen';
import SmallMenu from 'elements/SmallMenu';

export const Notification = React.createClass({

    componentWillMount(){
        this.setState({
            showNotifMenuIcon: false,
            showNotifMenu: false,
            timeStamp: moment(this.props.data.timeStamp, 'LLLL').fromNow(),
        });
    },

    componentDidMount(){
        const { acknowledged } = this.props.data;
        if (!acknowledged){
            const tl = new TimelineLite();
            tl.from(this.notifRef, 0.5, {
                ease: Power1.easeOut,
                height: 0,
                opacity: 0
            });
            tl.play();
        }

        this.interval = setInterval(this.updateTimestamp, 1000);
    },

    componentDidUpdate(prevProps, prevState){
        if (prevState.timeStamp !== this.state.timeStamp){
            const tl = new TimelineLite();
            tl.from(this.timeStampRef, 0.5, {
                ease: Power1.easeOut,
                opacity: 0
            });
            tl.play();
        }
    },

    componentWillUnmount(){
        clearInterval(this.interval);
    },

    updateTimestamp(){
        this.setState({
            timeStamp: moment(this.props.data.timeStamp, 'LLLL').fromNow()
        });
    },

    toggleNotifMenu(event){
        if (event){
            event.stopPropagation();
        }

        this.setState({
            showNotifMenu: !this.state.showNotifMenu
        });
    },

    handleDelete(){
        const {
            notifId,
            deleteNotif
        } = this.props;

        const tl = new TimelineLite();
        tl.to(this.notifRef, 0.2, {
            ease: Power1.easeOut,
            height: 0,
            opacity: 0
        });
        tl.play();
        tl.eventCallback('onComplete', deleteNotif, [notifId]);
    },

    render(){

        const {
            message,
            targets,
            senders,
            icon,
            following,
            favorites,
            blocked,
            blockedBy,
            checkFriendship,
            isSelf,
            followUser,
            favoriteUser,
            blockUser,
            clickNotif,
            displayFollowOption,
            route,
            data: {
                uid,
                username,
                displayName,
                avatar,
                acknowledged
            }
        } = this.props;

        const {
            showNotifMenu,
            timeStamp
        } = this.state;

        const renderNotifMessage = () => {

            // Counts the objects and renders text appropriately.


            const formatText = (obj, capitalize = false) => {
                const count = obj ? Object.keys(obj).length : -1;
                const keys = Object.keys(obj);

                const cap = str => {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                };

                const wrapInLink = (objDisp, objUser, objUid, capIt) => {
                    let dispName = isSelf(objUid) ? 'you' : objDisp;
                    dispName = capIt ? cap(dispName) : dispName;

                    return (
                        <Link
                            className="header-notification-message-link"
                            to={ `users/${ objUser }` }>
                            { dispName }
                        </Link>
                    );
                };

                if (count === 1){
                    const user1 = obj[keys[0]];
                    return (
                        <span>
                            { wrapInLink(user1.displayName, user1.username, user1.uid, capitalize) }
                        </span>
                    );
                } else if (count === 2){
                    const user1 = obj[keys[0]];
                    const user2 = obj[keys[1]];
                    return (
                        <span>
                            { wrapInLink(user1.displayName, user1.username, user1.uid, capitalize) }
                            { ' and ' }
                            { wrapInLink(user2.displayName, user2.username, user2.uid) }
                        </span>
                    );
                } else if (count === 3){
                    const user1 = obj[keys[0]];
                    const user2 = obj[keys[1]];
                    const user3 = obj[keys[2]];
                    return (
                        <span>
                            { wrapInLink(user1.displayName, user1.username, user1.uid, capitalize) }
                            { ', ' }
                            { wrapInLink(user2.displayName, user2.username, user2.uid) }
                            { ', and ' }
                            { wrapInLink(user3.displayName, user3.username, user3.uid) }
                        </span>
                    );
                } else if (count > 3){
                    const user1 = obj[keys[0]];
                    return (
                        <span>
                            { wrapInLink(user1.displayName, user1.username, user1.uid, capitalize) }
                            { ` and ${ count - 1 } others` };
                        </span>
                    );
                }

                return;
            };

            return (
                <div className="header-notification-message">
                    <p>
                        <Link
                            className="header-notification-message-link"
                            to={ `users/${ username }` }>
                            { displayName }
                        </Link>
                        { formatText(senders, true) } { message } { formatText(targets) }.
                    </p>
                </div>
            );
        };

        const renderMenu = () => {
            if (showNotifMenu){

                const settings = [];

                if (senders && Object.keys(senders).length === 1){
                    const sender = senders[Object.keys(senders)[0]];
                    const following = isFollowing(sender.uid);
                    const favorited = isFavorited(sender.uid);

                    if (following){
                        settings.push({
                            icon: favorited ? 'broken-heart' : 'heart',
                            iconColor: 'pink',
                            title: favorited ? `Remove ${ sender.displayName } from your favorites` : `Add ${ sender.displayName } to your favorites`,
                            callback: favoriteUser,
                            params: [sender.uid, sender.username, sender.displayName]
                        });
                    }

                    settings.push(
                        {
                            icon: following ? 'ban' : 'user-plus',
                            iconColor: following ? 'magenta' : 'lightgreen',
                            title: `${ following ? 'Unf' : 'F' }ollow ${ sender.displayName }`,
                            callback: followUser,
                            params: [sender.uid, sender.username, sender.displayName]
                        },
                        {
                            divider: true
                        },
                        {
                            icon: 'user-times',
                            iconColor: 'yellow',
                            title: `Block ${ sender.displayName }`,
                            callback: blockUser,
                            params: [sender.uid]
                        }
                    );
                }

                settings.push({
                    icon: 'times',
                    highlightColor: 'red',
                    title: 'Delete Notification',
                    callback: this.handleDelete,
                });

                return (
                    <div>
                        <ClickScreen onClick={ this.toggleNotifMenu } />
                        <SmallMenu
                            width="medium"
                            options={ settings }
                            onClose={ this.toggleNotifMenu } />
                    </div>
                );
            }

            return '';
        };

        return (
            <div
                onClick={ () => clickNotif(route) }
                ref={ element => this.notifRef = element }
                className={ `header-notification${ acknowledged ? ' received' : '' }` }>
                <div className="header-notification-img">
                    <img
                        src={ avatar }
                        alt={ displayName } />
                </div>
                <div className="header-notification-content">
                    <div
                        onClick={ e => this.toggleNotifMenu(e) }
                        className="header-notification-settings">
                        { renderMenu() }
                        <i className="fa fa-angle-down" aria-hidden="true" />
                    </div>
                    { renderNotifMessage() }
                    <div
                        ref={ element => this.timeStampRef = element }
                        className="header-notification-timestamp">
                        <i className={ `fa fa-${ icon }` } />
                        { timeStamp }
                    </div>
                </div>
            </div>
        );
    }
});

export default Notification;
