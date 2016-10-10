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
                        <h3>{ user.displayName }</h3>
                        <h5>{ user.email }</h5>
                    </div>
                }
            </div>
        );
    }
});

export default Redux.connect(state => {
    console.log('from Connect.jsx: state.user? ', state.user);
    return {
        user: state.user
    };
})(Connect);
