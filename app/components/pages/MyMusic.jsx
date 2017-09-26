import React, { Component } from 'react';
import { connect } from 'react-redux';

class MyMusic extends Component {

    render(){
        return (
            <div>MyMusic</div>
        );
    }
}

export default connect()(MyMusic);
