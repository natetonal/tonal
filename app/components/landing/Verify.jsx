import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Alert from 'helpers/Alert';

export const Verify = React.createClass({

    // For future reference:
    // Handle oobCode verification in the component, NOT in the router.

    handleQuery(query){
        const { dispatch } = this.props;
        const { mode, oobCode } = query;
        if(mode == 'verifyEmail' && oobCode){
            console.log('Verify.jsx: all needs are met to dispatch verifyEmail action!');
            return dispatch(actions.verifyEmailWithCode(oobCode));
        } else {
            return dispatch(actions.pushToRoute('/'));
        }
    },

    componentDidMount(){
        const { location: { query }} = this.props;
        this.handleQuery(query);
    },

    render(){

        return(
            <div>
                <Alert
                    type="warning"
                    title="Verifying E-Mail"
                    message={(
                        <div>
                            <p>One moment please while we verify your e-mail...</p>
                            <i className="fa fa-cog fa-spin fa-3x fa-fw float-center"></i>
                        </div>
                    )}
                />
                <div className={`auth-content blur`}></div>
            </div>
        );
    }
});

export default Redux.connect()(Verify);
