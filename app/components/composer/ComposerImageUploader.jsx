import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Dropzone from 'react-dropzone';

export const ComposerImageUploader = React.createClass({

    componentWillMount(){
        this.setState({
            dropzoneActive: false,
            error: ''
        });
    },

    onDragEnter(e) {
        if (e){ e.preventDefault(); }
        this.setState({ dropzoneActive: true });
    },

    onDragLeave(e) {
        if (e){ e.preventDefault(); }
        this.setState({ dropzoneActive: false });
    },

    acceptedTypes: ['image/gif', 'image/jpeg', 'image/png'],

    maxSize: 5242880,

    handleDrop(acc, rej){
        console.log('accepted file: ', acc);
        console.log('rejected file: ', rej);
        const accepted = acc ? acc[0] : false;
        const rejected = rej ? rej[0] : false;
        if (accepted && !rejected){
            const { handleImage, handleFile } = this.props;
            handleImage(accepted.preview);
            handleFile(accepted);
        } else {
            const size = rejected.size;
            const type = rejected.type;
            console.log('size: ', size);
            console.log('type: ', type);
            let title = '';
            let msg = '';

            if (size > this.maxSize){
                title = 'Invalid Image.';
                msg = 'The image you\'re trying to upload is too large. Please keep it under 5mb.';
            } else if (!this.acceptedTypes.includes(type)){
                title = 'Invalid Image.';
                msg = 'Please make sure you have selected a valid image format (jpg, gif, png)';
            } else {
                title = 'Uh Oh.';
                msg = 'Something strange just happened. Please try again.';
            }
            this.setState({
                error: {
                    title,
                    msg
                }
            });
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
                        accept={ this.acceptedTypes.join(', ') }
                        multiple={ false }
                        maxSize={ this.maxSize }
                        onDrop={ (acc, rej) => this.handleDrop(acc, rej) }
                        onDragEnter={ e => this.onDragEnter(e) }
                        onDragLeave={ e => this.onDragLeave(e) }
                        className={ `composer-image-dropzone-text ${ error && 'dropzone-error' }` }
                        activeClassName="composer-image-dropzone-text dropzone-active"
                        rejectClassName="composer-image-dropzone-text dropzone-error">
                        { displayText() }
                    </Dropzone>
                </div>
            </ReactCSSTransitionGroup>
        );
    }

});

export default ComposerImageUploader;
