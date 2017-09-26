import React, { Component } from 'react';
import { connect } from 'react-redux';

class TonalStore extends Component {

    render(){
        return (
            <div>Store</div>
        );
    }
}

export default connect()(TonalStore);
