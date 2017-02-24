import React from 'react';
import * as Redux from 'react-redux';
import { composerSetPreviewImage } from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export const ComposerImagePreviewer = React.createClass({

    componentWillMount(){
        this.setState({ warningLightOn: false });
    },

    handleClearImage(){
        const { dispatch } = this.props;
        dispatch(composerSetPreviewImage());
    },

    warningLight(){
        this.setState({
            warningLightOn: !this.state.warningLightOn
        });
    },

    render(){

        const { previewImage } = this.props;
        const { warningLightOn } = this.state;

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
                    <div className={ `composer-image-previewer ${ warningLightOn ? 'warning-light' : '' }` }>
                        <div className={ `composer-image-previewer-label ${ warningLightOn ? 'warning-light' : '' }` }>
                            { warningLightOn ? 'DELETE IMAGE?' : 'IMAGE PREVIEW' }
                        </div>
                        <div
                            className="composer-image-previewer-clear"
                            onMouseEnter={ this.warningLight }
                            onMouseLeave={ this.warningLight }
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

});

export default Redux.connect(state => {
    return {
        previewImage: state.composer.previewImage
    };
})(ComposerImagePreviewer);
