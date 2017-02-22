import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import {
    GiphySelectionSearchText,
    GiphySelectionFetchImages,
    GiphySelectionSwitchTabs,
    GiphySelectionReset
} from 'actions';

import GiphySelectorTabs from './GiphySelectorTabs';
import GiphySelectorSearch from './GiphySelectorSearch';
import GiphySelectorContainer from './GiphySelectorContainer';

export const GiphySelector = React.createClass({

    componentWillMount(){
    },

    componentDidMount(){
        this.getImages();
    },

    componentDidUpdate(prevProps){
        if (prevProps.currentMenu !== this.props.currentMenu){
            const { dispatch } = this.props;
            dispatch(GiphySelectionReset());
            this.getImages();
        } else if (prevProps.currentTab !== this.props.currentTab){
            this.getImages();
        }
    },

    getImages(){
        const {
            dispatch,
            currentMenu,
            currentTab,
            searchText
        } = this.props;
        const mode = `${ currentMenu }_${ currentTab }`;

        dispatch(GiphySelectionFetchImages(mode, searchText));
    },

    handleTabs(tab, event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(GiphySelectionSwitchTabs(tab));
    },

    selectImage(path){
        const { handleGiphy } = this.props;
        if (path) {
            handleGiphy(path);
        }
    },

    render(){

        const { currentTab } = this.props;

        return (
            <ReactCSSTransitionGroup
                transitionName="smooth-popin"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div className="giphy-selector">
                    <GiphySelectorTabs
                        onClick={ this.handleTabs } />
                    { currentTab === 'search' && <GiphySelectorSearch onSearch={ this.getImages } /> }
                    <GiphySelectorContainer
                        getImages={ this.getImages }
                        selectImage={ this.selectImage } />
                </div>
            </ReactCSSTransitionGroup>
        );
    }
});

export default Redux.connect(state => {
    return {
        currentMenu: state.composer.currentMenu,
        currentTab: state.giphySelector.currentTab,
        searchText: state.giphySelector.searchText
    };
})(GiphySelector);
