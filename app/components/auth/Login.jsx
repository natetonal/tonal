import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import LoginModal from './LoginModal';

export const Login = React.createClass({

    onEmailLogin(){

    },

    onFacebookLogin(){

    },

    render(){
        return(
            <div>
                <LoginModal />
                LOGIN
            </div>
        );
    }
});

export default Redux.connect()(Login);
