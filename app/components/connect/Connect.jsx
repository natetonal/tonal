import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Post from 'post/Post';
import Alert from 'elements/Alert';

// temporary
import moment from 'moment';
// temporary

export const Connect = React.createClass({

    render(){

        const { displayName, avatarPhoto } = this.props.user;
        // temporary dummy data
        const data = {
            displayName,
            avatarPhoto,
            timeStamp: moment().calendar(),
            message: `Here I stand, on my soapbox, pleading my passions to deaf ears, whispering lies to myself, only my tears to lubricate my wounded pride.`,
            likes: 16,
            thread: {
                1: {
                    displayName: 'Max Acree',
                    avatarPhoto: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar1.jpg?alt=media&token=781bf32f-4b8c-4e29-a241-d2339d730d87',
                    message: 'I can relate to this.',
                    likes: 2,
                    timeStamp: moment().calendar()
                },
                2: {
                    displayName: 'Scotty2Hotty',
                    avatarPhoto: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar2.jpg?alt=media&token=8e780831-36be-4dc1-9023-e8e0da091cb8',
                    message: 'You poetry sucks and you should feel bad.',
                    likes: 28,
                    timeStamp: moment().calendar()
                },
                3: {
                    displayName: 'Postin Up On Nobody Yo',
                    avatarPhoto: 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Ftestdata%2Favatar3.jpg?alt=media&token=3893b253-da4d-4cdb-be70-e1489daeabb2',
                    message: 'You suck and your poetry sucks.',
                    likes: 31,
                    timeStamp: moment().calendar()
                }
            }
        };
        // temporary dummy data

        return(
            <div className="connect-container-2">
                <Post data={ data } number='1' />
                <Post data={ data } number='2' />
                <Post data={ data } number='3' />
                <Post data={ data } number='4' />
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        user: state.user
    };
})(Connect);
