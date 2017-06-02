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
            following,
            blocked,
            followUser,
            blockUser,
            clickNotif,
            displayFollowOption,
            route,
            data: {
                type,
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
            switch (type){
                case 'follower-add':
                    return (
                        <div className="header-notification-message">
                            <p>
                                <Link
                                    className="header-notification-message-link"
                                    to={ `users/${ username }` }>
                                    { displayName }
                                </Link>
                                { ' started following you.' }
                            </p>
                        </div>
                    );
                default:
                    return '';
            }
        };

        const renderMenu = () => {
            if (showNotifMenu){

                let settings = [
                    {
                        icon: following ? 'ban' : 'user-plus',
                        iconColor: following ? 'magenta' : 'lightgreen',
                        title: `${ following ? 'Unf' : 'F' }ollow ${ displayName }`,
                        callback: followUser,
                        params: [uid]
                    },
                    {
                        icon: 'user-times',
                        iconColor: 'yellow',
                        title: `Block ${ displayName }`,
                        callback: blockUser,
                        params: [uid]
                    },
                    {
                        divider: true
                    },
                    {
                        icon: 'times',
                        highlightColor: 'red',
                        title: 'Delete Notification',
                        callback: this.handleDelete,
                    }
                ];

                if (!displayFollowOption){
                    settings = [settings.pop()];
                }

                return (
                    <div>
                        <ClickScreen onClick={ this.toggleNotifMenu } />
                        <SmallMenu
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
                        { timeStamp }
                    </div>
                </div>
            </div>
        );
    }
});

export default Notification;
