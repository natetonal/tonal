import React, { Component } from 'react';
import * as Redux from 'react-redux';
import {
    setPreviewImage,
    setImageUpload
} from 'actions/ComposerActions';
import {
    TweenLite,
    Power2
} from 'gsap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class ComposerImagePreviewer extends Component {

    componentWillMount(){
        this.setState({
            warningLightOn: false,
            className: this.props.className
        });
    }

    componentWillReceiveProps(nextProps){
        if (!nextProps.previewImage){
            this.warningLightOff();
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.imageUploadProgress !== prevProps.imageUploadProgress &&
            this.progressBarRef &&
            this.progressPercRef){
            const width = Math.floor(this.props.imageUploadProgress * 2);
            TweenLite.to(this.progressBarRef, 0.25, {
                ease: Power2.easeOut,
                width
            });

            TweenLite.from(this.progressPercRef, 0.25, {
                ease: Power2.easeOut,
                opacity: 0.75
            });
        }

        if (this.props.imageUploadState &&
            !prevProps.imageUploadState &&
            this.progressContainerRef){
            TweenLite.from(this.progressContainerRef, 0.25, {
                ease: Power2.easeOut,
                opacity: 0
            });
        }
    }

    handleClearImage(){
        const { dispatch } = this.props;
        dispatch(setPreviewImage());
        dispatch(setImageUpload());
    }

    warningLightOn(){
        this.setState({
            warningLightOn: true,
            className: `${ this.props.className } warning-light` });
    }

    warningLightOff(){
        this.setState({
            warningLightOn: false,
            className: this.props.className
        });
    }

    render(){

        const {
            previewImage,
            imageUploadState,
            imageUploadProgress
        } = this.props;

        const {
            warningLightOn,
            className
        } = this.state;

        const renderUploadScreen = () => {
            if (imageUploadState){
                return (
                    <div
                        ref={ element => this.progressContainerRef = element }
                        className="composer-image-previewer-progress-container">
                        <div className="composer-image-previewer-progress-label">
                            Uploading: <span ref={ element => this.progressPercRef = element }>{ imageUploadProgress }</span>%
                        </div>
                        <div className="composer-image-previewer-progress-bar-container">
                            <div
                                ref={ element => this.progressBarRef = element }
                                className="composer-image-previewer-progress-bar-fill" />
                        </div>
                    </div>
                );
            }
        };

        if (previewImage){
            return (
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="fade-and-grow"
                    transitionAppear
                    transitionAppearTimeout={ 200 }
                    transitionEnter={ false }
                    transitionLeave
                    transitionLeaveTimeout={ 200 }>
                    <div className={ className }>
                        { renderUploadScreen() }
                        <div className={ `composer-image-previewer-label ${ warningLightOn ? 'warning-light' : '' }` }>
                            { warningLightOn ? 'DELETE IMAGE?' : 'IMAGE PREVIEW' }
                        </div>
                        <div
                            className="composer-image-previewer-clear"
                            onMouseEnter={ this.warningLightOn }
                            onMouseLeave={ this.warningLightOff }
                            onClick={ this.handleClearImage }>
                            <i className="fa fa-times" aria-hidden="true" />
                        </div>
                        <div className="composer-image-preview-wrapper">
                            <img
                                className="composer-image-preview-img"
                                alt={ previewImage }
                                src={ previewImage } />
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            );
        }

        return <div />;
    }
}

export default Redux.connect(state => {
    return {
        previewImage: state.composer.previewImage
    };
})(ComposerImagePreviewer);
