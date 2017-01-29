
import React from 'react';
import * as Redux from 'react-redux';
import Button from 'elements/Button';

import Medium from './medium';

export const Composer2 = React.createClass({

    getInitialState(){
        return {
            focused: false
        };
    },

    componentDidMount(){
        this.medium = new Medium({
            element: document.getElementById('composer'),
            mode: Medium.partialMode,
            placeholder: 'Share your thoughts',
            tags: null,
            attributes: null,
            maxLength: 100
        });
    },

    submitPost(){
        event.preventDefault();
        console.log('Formatted post for submission: ?');
    },

    handleFocus(){
        this.setState({ focused: true });
    },

    handleBlur(){
        this.setState({ focused: false });
    },

    render(){

        const { focused } = this.state;
        const composerClass = `composer ${ focused ? 'composer-zoom-in' : '' }`;

        return (
            <div className="header-compose-post">
                <div className="composer-controls">
                    <div className="composer-control">
                        <i className="fa fa-smile-o" aria-hidden="true" />
                    </div>
                </div>
                <div className="composer-wrapper">
                    <div
                        id="composer"
                        className={ composerClass } />
                </div>
                <div className="composer-button">
                    <Button type="submit" btnType="main" btnText="Share it!" onClick={ this.submitPost } />
                </div>
            </div>
        );
    }
});

export default Redux.connect()(Composer2);
