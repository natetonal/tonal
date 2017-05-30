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
            followUser,
            blockUser,
            clickNotif,
            route,
            data: {
                type,
                uid,
                username,
                displayName,
                avatar,
                timeStamp,
                acknowledged
            }
        } = this.props;

        const { showNotifMenu } = this.state;

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

                const settings = [
                    {
                        icon: 'ban',
                        iconColor: 'magenta',
                        title: `Follow ${ displayName }`,
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
                    <div className="header-notification-timestamp">
                        { moment(timeStamp, 'LLLL').fromNow() }
                    </div>
                </div>
            </div>
        );
    }
});

export default Notification;
