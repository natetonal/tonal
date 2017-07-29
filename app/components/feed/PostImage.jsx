import React from 'react';
import {
    TimelineMax,
    TweenLite,
    Power1,
} from 'gsap';

export const PostImage = React.createClass({

    componentWillMount(){
        this.setState({ imageLoaded: false });
    },

    componentDidMount(){
        if (this.loadingContainerRef){
            this.loadingAnim = new TimelineMax();
            this.loadingAnim.to(this.loadingContainerRef, 0.5, {
                opacity: 0.75,
                repeat: -1,
                yoyo: true
            });
            this.loadingAnim.play();
        }
    },

    componentWillUpdate(nextProps, nextState){
        if (nextState.imageLoaded &&
            !this.state.imageLoaded){
            this.loadingAnim.stop();
        }
    },

    componentDidUpdate(prevProps, prevState){
        if (!prevState.imageLoaded &&
            this.state.imageLoaded){
            TweenLite.from(this.imageRef, 1, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    },

    handleImageLoaded(){
        this.setState({ imageLoaded: true });
    },

    render(){

        const {
            onClick,
            image,
            file
        } = this.props;

        const { imageLoaded } = this.state;

        const renderHiddenImage = () => {
            if (image){
                return (
                    <div className="hide">
                        <img
                            className={ `post-image${ file ? '-fullwidth' : '' }` }
                            onLoad={ () => this.handleImageLoaded() }
                            src={ image }
                            alt="" />
                    </div>
                );
            }

            return '';
        };

        const renderImage = () => {
            if (image){
                if (imageLoaded){
                    return (
                        <div
                            ref={ element => this.imageRef = element }
                            className={ `tonal-post-image ${ file ? 'fullwidth' : '' }` }
                            onClick={ () => onClick() }>
                            <img
                                className={ `post-image${ file ? '-fullwidth' : '' }` }
                                src={ image }
                                alt="" />
                        </div>
                    );
                } else if (!imageLoaded){
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

});

export default PostImage;
