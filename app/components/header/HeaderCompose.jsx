import React from 'react';
import * as Redux from 'react-redux';
import { headerComposeChangeTab } from 'actions';

// import HeaderComposeEditor from './HeaderComposeEditor'; - TEMPORARILY ABANDONED. REMEMBER TO DELETE IF NOT NEEDED.
import Composer from 'composer/Composer';

const headerComposeTabs = [
    {
        name: 'post',
        icon: 'comment'
    },
    {
        name: 'photos',
        icon: 'camera'
    },
    {
        name: 'videos',
        icon: 'video-camera'
    },
    {
        name: 'event',
        icon: 'calendar-plus-o'
    },
    {
        name: 'song',
        icon: 'microphone'
    }
];

export const HeaderCompose = React.createClass({

    handleTabClick(tab){
        const { dispatch } = this.props;
        dispatch(headerComposeChangeTab(tab));
    },

    render(){

        const { tabSelected } = this.props;

        const renderTabs = () => {
            return headerComposeTabs.map((tab, index) => {
                const { name, icon } = tab;
                return (
                    <div
                        key={ name + icon + index }
                        onClick={ () => this.handleTabClick(name) }
                        className={ `header-compose-tab ${ tabSelected === name ? 'selected' : '' }` }>
                        <i className={ `fa fa-${ icon }` } aria-hidden="true" />
                        { name }
                    </div>
                );
            });
        };

        const renderComponent = () => {
            let component = '';
            switch (tabSelected){
                case 'post':
                    component = <Composer />;
                    break;
                default:
                    component = '';
            }

            return component;
        };

        return (
            <div className="header-compose">
                <div className="header-compose-tab-set">
                    { renderTabs() }
                </div>
                <div className="header-compose-contentarea">
                    { renderComponent() }
                </div>


            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        tabSelected: state.headerCompose.currentTab
    };
})(HeaderCompose);
