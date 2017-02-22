import React from 'react';
import * as Redux from 'react-redux';

const tabsArray = [
    {
        title: 'trending',
        className: 'fa fa-line-chart'
    },
    {
        title: 'search',
        className: 'fa fa-search'
    },
    {
        title: 'random',
        className: 'fa fa-random'
    }
];

export const GiphySelectorTabs = React.createClass({

    render(){

        const { currentTab, onClick } = this.props;

        const tabs = () => {
            return tabsArray.map(({ title, className }) => {
                return (
                    <div
                        key={ className + title }
                        className={ `giphy-selector-tab ${ currentTab === title ? 'selected' : '' }` }
                        onClick={ event => onClick(title, event) }>
                        <i className={ className } aria-hidden="true" />
                        <span className="giphy-selector-tab-name">{ title }</span>
                    </div>
                );
            });
        };

        return (
            <div className="giphy-selector-tabs">
                { tabs() }
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentTab: state.giphySelector.currentTab,
        searchText: state.giphySelector.searchText
    };
})(GiphySelectorTabs);
