import React from 'react';
import * as Redux from 'react-redux';

const VerifyingEmail = React.createClass({

    render(){

        return (
            <div className="login-verification-email-sent">
                <i className="fa fa-thumbs-o-up fa-5x" aria-hidden="true"></i>
                <h2>Email Sent!</h2>
                <h5>{ messaging() }</h5>
            </div>
        );
    }
});

export default Redux.connect()(VerifyingEmail);
