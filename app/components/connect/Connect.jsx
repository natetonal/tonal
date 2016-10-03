import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Alert from 'helpers/Alert';

export const Connect = React.createClass({

    render(){

        const error = "Here's a message in an alert. Bam.";

        return(
            <div>
                <Alert
                    type="default"
                    title={`This is a default alert.`}
                    message={ error }
                />
                <Alert
                    type="info"
                    title={`This is an info alert.`}
                    message={ error }
                />
                <Alert
                    type="success"
                    title={`This is a success alert.`}
                    message={ error }
                />
                <Alert
                    type="error"
                    title={`This is a error alert.`}
                    message={ error }
                />
                <Alert
                    type="warning"
                    title={`This is a warning alert.`}
                    message={ error }
                />
                <Alert
                    type="admin"
                    title={`This is an admin alert.`}
                    message={ error }
                />
            </div>
        );
    }
});

export default Redux.connect()(Connect);
