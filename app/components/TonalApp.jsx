import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import Hammer from 'react-hammerjs';


import MenuWrapper from './MenuWrapper';
import Header from './Header';
import Tabs from './Tabs';

export const TonalApp = React.createClass({

    render(){

        return(
            <MenuWrapper>
                <Header />
                <div className="tonal-content">
                    {this.props.children}
                </div>
                <Tabs />
            </MenuWrapper>
        );
    }
});

export default Redux.connect()(TonalApp);
