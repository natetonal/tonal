import React from 'react';
import { verifyEmailWithCode } from 'actions/AuthActions';
import { pushToRoute } from 'actions/RouteActions';

import Alert from 'elements/Alert';

export const Verify = React.createClass({

    // For future reference:
    // Handle oobCode verification in the component, NOT in the router.

    // Load in your component here

    componentDidMount(){
        const { location: { query: { mode, oobCode }}} = this.props;
        this.handleQuery(mode, oobCode);
    },

    handleQuery(mode, oobCode){
        const { dispatch } = this.props;
        if (mode === 'verifyEmail' && oobCode){
            return dispatch(verifyEmailWithCode(oobCode));
        }

        return dispatch(pushToRoute('/'));

    },

    render(){

        return (
            <div>
                <Alert
                    type="warning"
                    title="Verifying E-Mail"
                    message={
                        (
                            <div>
                                <p>One moment please while we verify your e-mail...</p>
                                <i className="fa fa-cog fa-spin fa-3x fa-fw float-center" />
                            </div>
                        )
                    }
                />
                <div className={ 'auth-content blur' } />
            </div>
        );
    }
});

export default Verify;
