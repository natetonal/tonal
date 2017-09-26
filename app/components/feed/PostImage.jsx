import React, { Component } from 'react';
import {
    TimelineMax,
    TweenLite,
    Power1,
} from 'gsap';

class PostImage extends Component {

    constructor(props){

        super(props);

        const {
            image,
            screenSize
        } = this.props;
        let url = false;

        if (image){
            if (image.thumbs && image.thumbs[screenSize]){
                url = image.thumbs[screenSize];
            } else {
                url = image.url;
            }
        }

        this.state = {
            imageLoaded: false,
            imageError: false,
            imageUrl: url
        };
    }

    componentDidMount = () => {
        if (this.loadingContainerRef){
            this.loadingAnim = new TimelineMax();
            this.loadingAnim.to(this.loadingContainerRef, 0.5, {
                opacity: 0.75,
                repeat: -1,
                yoyo: true
            });
            this.loadingAnim.play();
        }
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.screenSize !== this.props.screenSize &&
            nextProps.screenSize &&
            nextProps.image.thumbs[nextProps.screenSize]){

            this.setState({
                imageUrl: nextProps.image.thumbs[nextProps.screenSize] || nextProps.image.url,
                imageLoaded: false,
                imageError: false
            });
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        if ((nextState.imageLoaded && !this.state.imageLoaded) ||
            (nextState.imageError && !this.state.imageError)){
            this.loadingAnim.stop();
        }
    }

    componentDidUpdate = (prevProps, prevState) => {

        if (!prevState.imageLoaded &&
            this.state.imageLoaded){
            TweenLite.from(this.imageRef, 1, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }

        if (!prevState.imageError &&
            this.state.imageError){
            TweenLite.from(this.errorContainerRef, 1, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    }

    handleImageLoaded = () => {
        this.setState({ imageLoaded: true });
    }

    handleImageError = () => {
        this.setState({ imageError: true });
    }

    render(){

        const {
            onClick,
            file,
        } = this.props;

        const {
            imageLoaded,
            imageError,
            imageUrl
        } = this.state;

        const renderHiddenImage = () => {
            if (imageUrl){
                return (
                    <div className="hide">
                        <img
                            className={ `post-image${ file ? '-fullwidth' : '' }` }
                            onLoad={ () => this.handleImageLoaded() }
                            onError={ () => this.handleImageError() }
                            src={ imageUrl }
                            alt="" />
                    </div>
                );
            }

            return '';
        };

        const renderImage = () => {
            if (imageUrl){
                if (imageLoaded && !imageError){
                    return (
                        <div
                            ref={ element => this.imageRef = element }
                            className={ `tonal-post-image ${ file ? 'fullwidth' : '' }` }
                            onClick={ () => onClick() }>
                            <img
                                className={ `post-image${ file ? '-fullwidth' : '' }` }
                                src={ imageUrl }
                                alt="" />
                        </div>
                    );
                } else if (!imageLoaded && imageError){
                    return (
                        <div
                            ref={ element => this.errorContainerRef = element }
                            className={ 'tonal-post-image-error' }>
                            <div className={ 'tonal-post-image-error-header' }>
                                This Image Is Gone
                            </div>
                            <div className={ 'tonal-post-image-error-icon' }>
                                <i className="fa fa-meh-o" aria-hidden="true" />
                            </div>
                            <div className={ 'tonal-post-image-error-message' }>
                                It looks like either the user deleted this image, or it vanished into the great cyber-cosmic ether.
                            </div>

                        </div>

                    );
                } else if (!imageLoaded && !imageError){
                    return (
                        <div
                            ref={ element => this.loadingContainerRef = element }
                            className={ 'tonal-post-image-loading' }>
                            <i
                                ref={ element => this.loadingIconRef = element }
                                className="fa fa-picture-o"
                                aria-hidden="true" />
                        </div>
                    );
                }
            }

            return '';
        };

        return (
            <div>
                { renderHiddenImage() }
                { renderImage() }
            </div>
        );
    }
}

export default PostImage;
