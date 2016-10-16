import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Alert from 'helpers/Alert';

export const Connect = React.createClass({

    render(){

        const error = "Here's a message in an alert. Bam.";
        const { user } = this.props;

        console.log('from Connect.jsx: user? ', user);

        return(
            <div>
                { user &&
                    <div>
                        <h3>Data we have about you:</h3>
                        <p><b>User ID: </b>{ user.uid }</p>
                        <p><b>Facebook Access Token: </b>{ user.fbToken }</p>
                        <p><b>Email: </b>{ user.email }</p>
                        <p><b>First Name: </b>{ user.firstName }</p>
                        <p><b>Last Name: </b>{ user.lastName }</p>
                        <p><b>Display Name: </b>{ user.displayName }</p>
                        <p><b>Time Zone: </b>{ user.timeZone }</p>
                        <p><b>Avatar Photo: </b><img src={ user.avatarPhoto } /></p>
                        <p><b>Updated At: </b>{ user.updatedAt }</p>
                    </div>
                }
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        user: state.user
    };
})(Connect);
