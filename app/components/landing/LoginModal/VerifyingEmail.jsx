import React from 'react';
import * as Redux from 'react-redux';

const VerifyingEmail = React.createClass({

    render(){
        return (
            <div className="login-verification-email-sent">
                <h2>Verifying Email</h2>
                <h3><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></h3>
            </div>
        );
    }
    
});

export default Redux.connect()(VerifyingEmail);
