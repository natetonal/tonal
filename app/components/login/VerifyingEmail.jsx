import React, { Component } from 'react';

class VerifyingEmail extends Component {

    render(){
        return (
            <div className="login-verifying-email">
                <h2>Verifying Email</h2>
                <h3>
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
                </h3>
                <h5>
                    { 'Your patience is appreciated while we verify that you\'re [more than likely] not a robot.' }
                </h5>
            </div>
        );
    }
}

export default VerifyingEmail;
