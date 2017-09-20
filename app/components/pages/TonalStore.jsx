import React, { Component } from 'react';
import * as Redux from 'react-redux';

class TonalStore extends Component {

    render(){
        return (
            <div>Store</div>
        );
    }
}

export default Redux.connect()(TonalStore);
