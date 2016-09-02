import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Input from './../../helpers/Input';
import Button from './../../helpers/Button';

export const Login = React.createClass({
    render(){
        return(
            <div>
                <Input name="Email or Username" />
                <Input name="Password" type="password" />
                <Button btnType="main" btnIcon="" btnText="Sign In" />
                <p className="text-center">-OR-</p>
                <Button btnType="facebook" btnIcon="fa-facebook-official" btnText="Sign In With Facebook" />
                <p className="text-center">
                    <Link to="#" className="forgot-password">I forgot my password</Link>
                </p>
            </div>
        );
    }
});

export default Redux.connect()(Login);
