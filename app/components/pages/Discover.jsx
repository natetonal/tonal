import React from 'react';
import * as Redux from 'react-redux';

export const Discover = React.createClass({

    render(){
        return (
            <div>Discover</div>
        );
    }
});

export default Redux.connect()(Discover);
