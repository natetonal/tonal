import React from 'react';
import * as Redux from 'react-redux';

export const TonalStore = React.createClass({

    render(){
        return (
            <div>Store</div>
        );
    }
});

export default Redux.connect()(TonalStore);
