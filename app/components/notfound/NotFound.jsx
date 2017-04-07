import React from 'react';

export const NotFound = React.createClass({

    render(){

        console.log('props from NotFound: ', this.props);
        return (
            <div>
                Route Not Found.
            </div>
        );
    }

});

export default NotFound;
