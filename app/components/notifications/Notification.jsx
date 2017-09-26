import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
    TimelineLite,
    Power1
} from 'gsap';

import ClickScreen from 'elements/ClickScreen';
import SmallMenu from 'elements/SmallMenu';

class Notification extends Component {

    constructor(props){

        super(props);

        const oneSender = (this.props.senders && Object.keys(this.props.senders).length === 1);
        const sender = oneSender ? this.props.senders[Object.keys(this.props.senders)[0]] : false;

        this.state = {
            showNotifMenuIcon: false,
            showNotifMenu: false,
            timeStamp: this.processTimestamp(),
            oneSender: sender,
            isFollowing: false,
            isFavorited: false
        };
    }

    componentDidMount = () => {
        const { acknowledged } = this.props.notif;
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

        if (this.state.oneSender){
            this.updateFriendshipsForSingleSender();
        }
    }

    componentWillReceiveProps = nextProps => {
        console.log(`favorites prev: ${ this.props.favoritesCount } next: ${ nextProps.favoritesCount }`);
        console.log(`following prev: ${ this.props.followingCount } next: ${ nextProps.followingCount }`);
        if (this.state.oneSender &&
            (this.props.followingCount !== nextProps.followingCount ||
            this.props.favoritesCount !== nextProps.favoritesCount)){
            this.updateFriendshipsForSingleSender();
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.timeStamp !== this.state.timeStamp){
            const tl = new TimelineLite();
            tl.from(this.timeStampRef, 0.5, {
                ease: Power1.easeOut,
                opacity: 0
            });
            tl.play();
        }

        if (this.state.oneSender !== prevState.oneSender){
            this.updateFriendshipsForSingleSender(this.state.oneSender);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    processTimestamp = () => {
        const sameOrBefore = moment().subtract(3, 'days').isSameOrBefore(moment(this.props.notif.timeStamp, 'LLLL'));
        if (sameOrBefore){
            return moment(this.props.notif.timeStamp, 'LLLL').fromNow();
        }

        return this.props.notif.timeStamp;
    }

    updateTimestamp = () => {
        this.setState({
            timeStamp: this.processTimestamp()
        });
    }

    updateFriendshipsForSingleSender = () => {
        const sender = this.state.oneSender || false;
        console.log('sender received by updateFriendshipsForSingleSender: ', sender);
        const isFollowing = sender ? this.props.checkFriendship(sender.uid, 'following') : false;
        const isFavorited = sender ? this.props.checkFriendship(sender.uid, 'favorites') : false;
        this.setState({
            isFollowing,
            isFavorited
        });
    }

    toggleNotifMenu = event => {
        if (event){
            event.stopPropagation();
        }

        this.setState({
            showNotifMenu: !this.state.showNotifMenu
        });
    }

    handleDelete = () => {
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
    }

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
            route,
            notif: {
                avatar,
                acknowledged
            }
        } = this.props;

        const {
            showNotifMenu,
            timeStamp,
            oneSender,
            isFollowing,
            isFavorited
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
                    if (isSelf(objUid)){ return 'you'; }

                    const dispName = capIt ? cap(objDisp) : objDisp;

                    return (
                        <Link
                            className="notification-message-link"
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
                <div className="notification-message">
                    <p>
                        { formatText(senders, true) } { message } { formatText(targets) }.
                    </p>
                </div>
            );
        };

        const renderMenu = () => {
            if (showNotifMenu){

                const settings = [];

                if (oneSender){
                    const sender = oneSender;

                    if (isFollowing){
                        settings.push({
                            icon: isFavorited ? 'broken-heart' : 'heart',
                            iconColor: isFavorited ? 'midgray' : 'white',
                            title: isFavorited ? `Remove ${ sender.displayName } from your favorites` : `Add ${ sender.displayName } to your favorites`,
                            callback: favoriteUser,
                            params: [sender.uid, sender.username, sender.displayName]
                        });
                    }

                    settings.push(
                        {
                            icon: isFollowing ? 'user-times' : 'user-plus',
                            iconColor: isFollowing ? 'midgray' : 'white',
                            title: `${ isFollowing ? 'Unf' : 'F' }ollow ${ sender.displayName }`,
                            callback: followUser,
                            params: [sender.uid, sender.username, sender.displayName]
                        },
                        {
                            divider: true
                        },
                        {
                            icon: 'ban',
                            iconColor: 'midgray',
                            highlightColor: 'red',
                            title: `Block ${ sender.displayName }`,
                            callback: blockUser,
                            params: [sender.uid]
                        }
                    );
                }

                settings.push({
                    icon: 'times',
                    iconColor: 'midgray',
                    highlightColor: 'red',
                    title: 'Delete Notification',
                    callback: this.handleDelete,
                });

                return (
                    <ClickScreen handleClick={ this.toggleNotifMenu }>
                        <SmallMenu
                            width="medium"
                            options={ settings }
                            onClose={ this.toggleNotifMenu } />
                    </ClickScreen>
                );
            }

            return '';
        };

        return (
            <div
                onClick={ () => clickNotif(route) }
                ref={ element => this.notifRef = element }
                className={ `notification${ acknowledged ? ' received' : '' }` }>
                <div className="notification-img">
                    <img
                        src={ avatar }
                        alt={ 'User Avatar' } />
                </div>
                <div className="notification-content">
                    <div
                        onClick={ e => this.toggleNotifMenu(e) }
                        className="notification-settings">
                        { renderMenu() }
                        <i className="fa fa-angle-down" aria-hidden="true" />
                    </div>
                    { renderNotifMessage() }
                    <div
                        ref={ element => this.timeStampRef = element }
                        className="notification-timestamp">
                        <i className={ `fa fa-${ icon }` } />
                        { timeStamp }
                    </div>
                </div>
            </div>
        );
    }
}

export default Notification;
