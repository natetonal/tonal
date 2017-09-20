import React, { Component } from 'react';
import * as Redux from 'react-redux';

class Discover extends Component {

    render(){
        return (
            <div>Discover</div>
        );
    }
}

export default Redux.connect()(Discover);
