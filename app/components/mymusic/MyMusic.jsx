import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const MyMusic = React.createClass({

    render(){
        return(
            <div>MyMusic</div>
        );
    }
});

export default Redux.connect()(MyMusic);
