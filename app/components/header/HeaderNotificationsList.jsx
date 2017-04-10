import React from 'react';
import * as Redux from 'react-redux';
import { toggleNotifs } from 'actions/UIStateActions';

// temporary
import moment from 'moment';
// temporary

import HeaderNotification from './HeaderNotification';

export const HeaderNotificationsList = React.createClass({

    handleNotifsMenu(event){
        event.preventDefault();
        const { dispatch, isNotifsOpen } = this.props;
        if (isNotifsOpen){
            dispatch(toggleNotifs());
        }
    },

    render(){

        // temporary dummy data:
        const someNotifs = [
            {
                type: 'postReply',
                received: true,
                displayName: 'Postin Up On Nobody Yo',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar3.jpg?alt=media&token=3893b253-da4d-4cdb-be70-e1489daeabb2',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: false,
                displayName: 'Scotty2Hotty',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar2.jpg?alt=media&token=8e780831-36be-4dc1-9023-e8e0da091cb8',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: false,
                displayName: 'Max Acree',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar1.jpg?alt=media&token=781bf32f-4b8c-4e29-a241-d2339d730d87',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: true,
                displayName: 'CoolGuy2185930',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: true,
                displayName: 'Postin Up On Nobody Yo',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar3.jpg?alt=media&token=3893b253-da4d-4cdb-be70-e1489daeabb2',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: false,
                displayName: 'Scotty2Hotty',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar2.jpg?alt=media&token=8e780831-36be-4dc1-9023-e8e0da091cb8',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: false,
                displayName: 'Max Acree',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar1.jpg?alt=media&token=781bf32f-4b8c-4e29-a241-d2339d730d87',
                timeStamp: moment().calendar(),
            },
            {
                type: 'postReply',
                received: true,
                displayName: 'CoolGuy2185930',
                avatar: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954',
                timeStamp: moment().calendar(),
            }
        ];

        const makeSomeNotifs = () => {
            return someNotifs.map((notif, index) => {
                return (
                    <HeaderNotification
                        key={ `notif_${index}` }
                        data={ notif } />
                );
            });
        };

        return (
            <div onMouseLeave={ this.handleNotifsMenu } >
                <div className="header-notifications-list">
                    { makeSomeNotifs() }
                </div>
                <div className="header-notifications-lip" />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isNotifsOpen: state.uiState.notifsIsOpen
    };
})(HeaderNotificationsList);
