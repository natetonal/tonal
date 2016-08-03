import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

export const Tabs = React.createClass({
    
    render(){
        return(
            <div className="tonal-tabs">
                <ul>
                    <li><Link to="connect" data-hover="Connect"><i className="fa fa-comment" aria-hidden="true"></i><span className="link-name">Connect</span></Link></li>
                    <li><Link to="discover" data-hover="Discover"><i className="fa fa-headphones" aria-hidden="true"></i><span className="link-name">Discover</span></Link></li>
                    <li><Link to="store" data-hover="Store"><i className="fa fa-shopping-cart" aria-hidden="true"></i><span className="link-name">Store</span></Link></li>
                    <li><Link to="mymusic" data-hover="My Music"><i className="fa fa-music" aria-hidden="true"></i><span className="link-name">My Music</span></Link></li>
                </ul>
            </div>
        );
    }
});

export default Redux.connect()(Tabs);
