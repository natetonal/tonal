import React from 'react';
import * as Redux from 'react-redux';
import { changeTab } from 'actions/HeaderComposeActions';

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
        dispatch(changeTab(tab));
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
            const { onClose } = this.props;
            let component = '';
            switch (tabSelected){
                case 'post':
                    component = <Composer onClose={ onClose } />;
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
