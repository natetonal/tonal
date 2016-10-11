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
                        <img src={ user.photoURL } />
                        <img src={ user.largePhotoURL } />
                        <h3>{ user.displayName } ({ user.firstName })</h3>
                        <h5>{ user.email }</h5>

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
