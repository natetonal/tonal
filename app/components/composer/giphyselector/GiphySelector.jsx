import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as Redux from 'react-redux';
import {
    fetchImages,
    switchTabs,
    resetImages,
    resetState
} from 'actions/GiphySelectorActions';

import GiphySelectorTabs from './GiphySelectorTabs';
import GiphySelectorSearch from './GiphySelectorSearch';
import GiphySelectorContainer from './GiphySelectorContainer';

class GiphySelector extends Component {

    componentDidMount(){
        this.getImages();
    }

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;

        if (nextProps.status === 'success' &&
            nextProps.currentTab === 'random' &&
            nextProps.images.length === 1){
            this.selectImage(nextProps.images[0]);
        }

        if (this.props.currentTab !== nextProps.currentTab){
            dispatch(resetImages());
        } else if (this.props.currentMenu !== nextProps.currentMenu){
            dispatch(resetState());
        }
    }

    componentDidUpdate(prevProps){
        if ((prevProps.currentMenu !== this.props.currentMenu ||
            prevProps.currentTab !== this.props.currentTab) &&
            this.props.status !== 'fetching'){
            this.getImages();
        }
    }

    componentWillUnmount(){
        const { dispatch } = this.props;
        dispatch(resetState());
    }

    getImages(){
        const {
            dispatch,
            currentMenu,
            currentTab,
            searchText
        } = this.props;
        const mode = `${ currentMenu }_${ currentTab }`;

        dispatch(fetchImages(mode, searchText));
    }

    handleTabs(tab, event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(switchTabs(tab));
    }

    selectImage(path){
        const { handleGiphy, dispatch } = this.props;
        if (path) {
            handleGiphy(path);
        }
    }

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
}

export default Redux.connect(state => {
    return {
        currentMenu: state.composer.currentMenu,
        currentTab: state.giphySelector.currentTab,
        searchText: state.giphySelector.searchText,
        status: state.giphySelector.status,
        images: state.giphySelector.images
    };
})(GiphySelector);
