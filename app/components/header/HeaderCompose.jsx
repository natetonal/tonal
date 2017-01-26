import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

// import HeaderComposeEditor from './HeaderComposeEditor'; - TEMPORARILY ABANDONED. REMEMBER TO DELETE IF NOT NEEDED.
import Composer from 'composer/Composer';

export const HeaderCompose = React.createClass({

    componentWillMount(){
        this.setState({
            tabSelected: 'post'
        });
    },

    handleTabClick(tab){
        console.log(tab);
        this.setState({
            tabSelected: tab
        });
    },

    render(){

        const { tabSelected } = this.state;

        return(
            <div className="header-compose">
                <div className="header-compose-tab-set">
                    <div onClick={ () => this.handleTabClick('post') }
                         className={`header-compose-tab ${ tabSelected == 'post' ? 'selected' : '' }`}>
                         <i className="fa fa-comment" aria-hidden="true"></i>
                         Post
                    </div>
                    <div onClick={ () => this.handleTabClick('photos') }
                         className={`header-compose-tab ${ tabSelected == 'photos' ? 'selected' : '' }`}>
                         <i className="fa fa-camera" aria-hidden="true"></i>
                         Photos
                    </div>
                    <div onClick={ () => this.handleTabClick('videos') }
                        className={`header-compose-tab ${ tabSelected == 'videos' ? 'selected' : '' }`}>
                        <i className="fa fa-video-camera" aria-hidden="true"></i>
                         Videos
                    </div>
                    <div onClick={ () => this.handleTabClick('event') }
                         className={`header-compose-tab ${ tabSelected == 'event' ? 'selected' : '' }`}>
                         <i className="fa fa-calendar-plus-o" aria-hidden="true"></i>
                         Event
                    </div>
                    <div onClick={ () => this.handleTabClick('song') }
                         className={`header-compose-tab ${ tabSelected == 'song' ? 'selected' : '' }`}>
                         <i className="fa fa-microphone" aria-hidden="true"></i>
                         Song
                    </div>
                </div>
                <div className="header-compose-contentarea">
                    <Composer />
                </div>


            </div>
        );
    }
});

export default Redux.connect(state => {
    return {

     };
})(HeaderCompose);
