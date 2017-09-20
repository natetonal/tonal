import React, { Component } from 'react';

class NotFound extends Component {

    render(){

        console.log('props from NotFound: ', this.props);
        return (
            <div>
                Route Not Found.
            </div>
        );
    }
}

export default NotFound;
