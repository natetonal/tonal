import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Input from './../../helpers/Input';
import Button from './../../helpers/Button';

export const Signup = React.createClass({
    render(){
        return(
            <div>
                <Input name="Email" />
                <Input name="Username" />
                <Input name="Password" type="password" />
                <Input name="Confirm Password" type="password" />
                <Button btnType="main" btnIcon="" btnText="Create Account" />
            </div>
        );
    }
});

export default Redux.connect()(Signup);
