import React, { Component } from 'react';
import * as Redux from 'react-redux';

class MyMusic extends Component {

    render(){
        return (
            <div>MyMusic</div>
        );
    }
}

export default Redux.connect()(MyMusic);
