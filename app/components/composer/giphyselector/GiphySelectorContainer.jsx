import React, { Component } from 'react';
import * as Redux from 'react-redux';
import Waypoint from 'react-waypoint';

class GiphySelectorContainer extends Component {

    render(){

        const {
            status,
            images,
            getImages,
            imgLimit,
            selectImage
        } = this.props;

        const fillerText = (text, className) => {

            return (
                <div className="giphy-placeholder">
                    <i className={ className } />
                    { text ? <span className="giphy-placeholder-text">{ text }</span> : '' }
                </div>
            );
        };

        const giphyItems = () => {
            switch (status){
                case 'fetching':
                case 'success':
                    if (images.length > 0){
                        return images.map((img, index) => {
                            return (
                                <div
                                    key={ `id_${ img }${ index }` }
                                    className="giphy-item"
                                    onClick={ () => selectImage(img) }>
                                    <img
                                        src={ img }
                                        alt={ img } />
                                </div>
                            );
                        });
                    }

                    if (images.length === 0 && status === 'success'){
                        return fillerText('No images found.', 'fa fa-meh-o');
                    }
                    return fillerText('Fetching images...', 'fa fa-circle-o-notch fa-spin fa-fw');
                case 'failure':
                    return fillerText('Something went wrong.', 'fa fa-meh-o');
                default:
                    return fillerText('Component loading.', 'fa fa-circle-o-notch fa-spin fa-fw');
            }
        };

        const waypoint = () => {
            if (status !== 'fetching' && images.length >= imgLimit) {
                return (
                    <div className="giphy-selector-waypoint">
                        <Waypoint
                            bottomOffset="-300px"
                            onEnter={ () => getImages() } />
                    </div>
                );
            }
        };

        const loader = () => {
            if (status === 'fetching' && images.length > 0) {
                return fillerText('Loading more images', 'fa fa-circle-o-notch fa-spin fa-fw');
            }
        };

        return (
            <div
                className="giphy-selector-container">
                { giphyItems() }
                { waypoint() }
                { loader() }
            </div>
        );
    }
}

export default Redux.connect(state => {
    return {
        status: state.giphySelector.status,
        images: state.giphySelector.images,
        imgLimit: state.giphySelector.imgLimit
    };
})(GiphySelectorContainer);
