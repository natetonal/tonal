import React from 'react';
import * as Redux from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Dropzone from 'react-dropzone';

export const ComposerImageUploader = React.createClass({

    componentWillMount(){
        this.setState({
            error: ''
        });
    },

    handleDrop(files){
        const image = files[0].preview || false;
        if (image){

            // Basic image format validation
            const validImage = new Image();
            validImage.onload = () => {
                const { handleImage, handleFile } = this.props;
                handleImage(image);
                handleFile(files[0]);
            };

            validImage.onerror = () => {
                this.setState({
                    error: {
                        title: 'Invalid Image.',
                        msg: 'Please make sure you have selected a valid image format (jpg, gif, tiff, png)'
                    }
                });
            };

            validImage.src = files[0].preview;
        }
    },

    render(){

        const { error } = this.state;

        const displayText = () => {
            if (error){
                return (
                    <div>
                        <span className="composer-image-dropzone-text-title">{ error.title }</span>
                        <span>{ error.msg }</span>
                    </div>
                );
            }

            return (
                <div>
                    <span>Drag and drop image here</span>
                    <span>-OR-</span>
                    <span>Click/tap to upload</span>
                </div>
            );
        };

        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fade-and-grow"
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave
                transitionLeaveTimeout={ 200 }>
                <div className="composer-image-uploader">
                    <Dropzone
                        multiple={ false }
                        onDrop={ this.handleDrop }
                        className={ `composer-image-dropzone-text ${ error ? 'dropzone-error' : '' }` }>
                        { displayText() }
                    </Dropzone>
                </div>
            </ReactCSSTransitionGroup>
        );
    }

});

export default Redux.connect(state => {
    return {};
})(ComposerImageUploader);
