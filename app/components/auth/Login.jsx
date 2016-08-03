import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Login = React.createClass({

    onEmailLogin(){

    },

    onFacebookLogin(){

    },

    render(){
        return(
            <div className="tonal__content">Login</div>
        );
    }
});

export default Redux.connect()(Login);
