import React from 'react';
import * as Redux from 'react-redux';

const VerifyingEmail = React.createClass({

    render(){
        return (
            <div className="login-verifying-email">
                <h2>Verifying Email</h2>
                <h3>
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                </h3>
                <h5>Your patience is appreciated while we verify that you're [more than likely] not a robot.</h5>
            </div>
        );
    }

});

export default Redux.connect()(VerifyingEmail);
