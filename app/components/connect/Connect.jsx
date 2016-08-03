import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Connect = React.createClass({

    render(){
        return(
            <div>Connect</div>
        );
    }
});

export default Redux.connect()(Connect);
