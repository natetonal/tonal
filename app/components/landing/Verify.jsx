import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Verify = React.createClass({

    // handleQuery(query){
    //     const { dispatch } = this.props;
    //     const { mode, oobCode } = query;
    //     if(mode == 'verifyEmail' && oobCode){
    //         console.log('Verify.jsx: all needs are met to dispatch verifyEmail action!');
    //         return dispatch(actions.verifyEmail(oobCode));
    //     } else {
    //         return dispatch(actions.rerouteUser('/'));
    //     }
    // },

    render(){

        // const { location: { query }} = this.props;
        // this.handleQuery(query);

        return(
            <div>
                <div className="callout verifying-email">
                    <h4>Verifying E-Mail</h4>
                    <p>One moment please while we verify your e-mail...</p>
                    <i className="fa fa-cog fa-spin fa-3x fa-fw float-center"></i>
                </div>
                <div className={`auth-content blur`}>

                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        verificationEmailSent: state.auth.verificationEmailSent
    };
})(Verify);
