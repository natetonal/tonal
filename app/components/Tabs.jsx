import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Tabs extends Component {

    render(){
        return (
            <div className="tonal-tabs">
                <ul>
                    <li>
                        <Link to="connect" data-hover="Connect">
                            <span className="tab-icon tab-connect" />
                            <span className="link-name">Connect</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="discover" data-hover="Discover">
                            <span className="tab-icon tab-discover" />
                            <span className="link-name">Discover</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="store" data-hover="Store">
                            <span className="tab-icon tab-store" />
                            <span className="link-name">Store</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="mymusic" data-hover="My Music">
                            <span className="tab-icon tab-mymusic" />
                            <span className="link-name">My Music</span>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Tabs;
