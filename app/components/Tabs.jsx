import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

export const Tabs = React.createClass({

    render(){
        return(
            <div className="tonal-tabs">
                <ul>
                    <li>
                        <Link to="connect" data-hover="Connect">
                            <span className="tab-icon tab-connect"></span>
                            <span className="link-name">Connect</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="discover" data-hover="Discover">
                            <span className="tab-icon tab-discover"></span>
                            <span className="link-name">Discover</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="store" data-hover="Store">
                            <span className="tab-icon tab-store"></span>
                            <span className="link-name">Store</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="mymusic" data-hover="My Music">
                            <span className="tab-icon tab-mymusic"></span>
                            <span className="link-name">My Music</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
});

export default Redux.connect()(Tabs);
