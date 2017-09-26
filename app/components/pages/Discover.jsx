import React, { Component } from 'react';
import { connect } from 'react-redux';

class Discover extends Component {

    render(){

        console.log('Discover rendered.');

        return (
            <div>Discover</div>
        );
    }
}

export default connect()(Discover);
