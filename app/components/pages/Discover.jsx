import React, { Component } from 'react';
import * as Redux from 'react-redux';

class Discover extends Component {

    render(){

        console.log('Discover rendered.');

        return (
            <div>Discover</div>
        );
    }
}

export default Redux.connect()(Discover);
