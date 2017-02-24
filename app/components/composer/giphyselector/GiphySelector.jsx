import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import {
    GiphySelectionSearchText,
    GiphySelectionFetchImages,
    GiphySelectionSwitchTabs,
    GiphySelectionResetImages,
    GiphySelectionResetState
} from 'actions';

import GiphySelectorTabs from './GiphySelectorTabs';
import GiphySelectorSearch from './GiphySelectorSearch';
import GiphySelectorContainer from './GiphySelectorContainer';

export const GiphySelector = React.createClass({

    componentDidMount(){
        this.getImages();
    },

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;

        if (nextProps.status === 'success' &&
            nextProps.currentTab === 'random' &&
            nextProps.images.length === 1){
            this.selectImage(nextProps.images[0]);
            console.log('selecting image', nextProps.images[0]);
        }

        if (this.props.currentTab !== nextProps.currentTab){
            console.log('resetting images');
            dispatch(GiphySelectionResetImages());
        } else if (this.props.currentMenu !== nextProps.currentMenu){
            console.log('resetting state');
            dispatch(GiphySelectionResetState());
        }
    },

    componentDidUpdate(prevProps){
        if ((prevProps.currentMenu !== this.props.currentMenu ||
            prevProps.currentTab !== this.props.currentTab) &&
            this.props.status !== 'fetching'){
            console.log('getting more images', this.props);
            this.getImages();
        }
    },

    componentWillUnmount(){
        const { dispatch } = this.props;
        dispatch(GiphySelectionResetState());
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
        const { handleGiphy, dispatch } = this.props;
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
        searchText: state.giphySelector.searchText,
        status: state.giphySelector.status,
        images: state.giphySelector.images
    };
})(GiphySelector);
