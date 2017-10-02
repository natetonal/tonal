import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    Field,
    reduxForm
} from 'redux-form';
import {
    TimelineLite,
    Power2,
    Back
} from 'gsap';
import Dropzone from 'react-dropzone';
import { updateUserData } from 'actions/UserActions';
import Input from 'elements/Input';
import Button from 'elements/Button';
import LocationInput from 'elements/LocationInput';
import {
    validate,
    warn
} from './validate';

class FirstTimeUserPrompt extends Component {

    constructor(props){
        // Where to store the optional uploaded image blob

        super(props);

        this.state = {
            blob: false
        };
    }

    componentDidMount = () => {

        // Enter Animation
        const tl = new TimelineLite();
        tl.from(this.overlayRef, 0.5, {
            ease: Power2.easeOut,
            opacity: 1
        });
        tl.from(this.containerRef, 1, {
            ease: Back.easeOut.config(1.4),
            opacity: 0,
            top: '50vh'
        }, '-=0.5');
        tl.staggerFrom([this.avatarRef, this.displayNameRef, this.usernameRef, this.locationRef], 0.5, {
            ease: Power2.easeOut,
            opacity: 0,
            x: 100
        }, 0.1);
        tl.from(this.submitRef, 0.5, {
            ease: Power2.easeOut,
            opacity: 0,
            y: 50,
        }, '-=0.5');
        tl.play();
    }

    componentDidUpdate = prevState => {
        if (prevState.blob !== this.state.blob){
            const tl = new TimelineLite();
            tl.from(this.avatarImgRef, 0.5, {
                ease: Power2.easeOut,
                opacity: 0,
            });
            tl.play();
        }

        if (this.props.submitSucceeded){
            this.animateOut();
        }
    }

    handleStop = event => {
        event.preventDefault();
    }

    handleDrop = files => {
        const image = files[0].preview || false;
        if (image){

            // Basic image format validation
            const validImage = new Image();
            validImage.onload = () => {
                this.setState({ blob: image });
            };

            validImage.onerror = () => {
            };

            validImage.src = files[0].preview;
        }
    }

    animateOut = () => {
        const exitTl = new TimelineLite();
        exitTl.to(this.containerRef, 1, {
            ease: Back.easeIn.config(1.4),
            opacity: 0,
            top: '50vh'
        });
        exitTl.to(this.overlayRef, 0.5, {
            ease: Power2.easeOut,
            opacity: 0
        });
        exitTl.play();
        exitTl.eventCallback('onComplete', this.closeThis);
    }

    closeThis = () => {
        const { dispatch } = this.props;
        dispatch(updateUserData({ firstLogin: false }));
    }

    handleFormSubmit = values => {
        console.log('handleFormSubmit called.');
        const { dispatch } = this.props;
        dispatch(updateUserData(values));
    }

    handlePlaceChange = place => {
        const { change } = this.props;
        change('location', place);
    }

    render(){

        const {
            displayName,
            username,
            avatar,
            location,

            // From Redux-Form
            handleSubmit,
            submitting
        } = this.props;

        const { blob } = this.state;

        const formatUsername = value => {
            if (value){
                return value.toLowerCase()
                            .replace(/[^0-9A-Za-z]/i, '');
            }

            return '';
        };

        const formatDisplayName = value => {
            if (value){
                return value.toLowerCase()
                            .replace(/[^0-9A-Za-z().&!? ]/i, '')
                            .replace(/\b[0-9A-Za-z().&!? ]/g, l => l.toUpperCase());
            }

            return '';
        };

        const formatLocation = value => {
            return value;
        };

        return (
            <div
                className="ftu-prompt-overlay"
                ref={ element => this.overlayRef = element }>
                <div
                    className="ftu-prompt-container"
                    ref={ element => this.containerRef = element }>
                    <form>
                        <div className="ftu-prompt-content">
                            <div className="ftu-prompt-title">
                                { 'You\'re Almost There!' }
                            </div>
                            <div className="ftu-prompt-messaging">
                                {
                                    'Let\'s make sure we have it right.'
                                }
                            </div>
                            <div className="ftu-prompt-categories">
                                <div
                                    ref={ element => this.avatarRef = element }
                                    className="ftu-prompt-category ftu-prompt-avatar">
                                    <div className="ftu-prompt-category-label ftu-prompt-avatar-label">
                                        Avatar Photo:
                                    </div>
                                    <div className="ftu-prompt-item ftu-prompt-avatar-item">
                                        <Dropzone
                                            multiple={ false }
                                            onDrop={ this.handleDrop }>
                                            <div className="ftu-prompt-avatar-overlay">
                                                <span>
                                                    <i className="fa fa-pencil" aria-hidden="true" />Edit Avatar</span>
                                            </div>
                                            <img
                                                className="ftu-prompt-avatar-image"
                                                ref={ element => this.avatarImgRef = element }
                                                src={ blob || avatar }
                                                alt={ displayName } />
                                        </Dropzone>
                                    </div>
                                </div>
                                <div
                                    ref={ element => this.displayNameRef = element }
                                    className="ftu-prompt-category ftu-prompt-display-name">
                                    <div className="ftu-prompt-item ftu-prompt-display-name-item">
                                        <Field
                                            name="displayName"
                                            label="Full Name / Display Name"
                                            type="text"
                                            tooltip={ 'This is how everyone else will view you on our network. We recommend making it the same name you use in your day-to-day life, your artist name, or your band name.' }
                                            component={ Input }
                                            format={ value => formatDisplayName(value) }
                                            onPaste={ this.handleStop }
                                            onDrop={ e => this.handleStop(e) } />
                                    </div>
                                </div>
                                <div
                                    ref={ element => this.usernameRef = element }
                                    className="ftu-prompt-category ftu-prompt-username">
                                    <div className="ftu-prompt-item ftu-prompt-username-item">
                                        <Field
                                            name="username"
                                            label="User Name"
                                            type="text"
                                            tooltip={ 'This will be how Tonal identifies you internally. This name will appear in your profile address and in shared content from you. Choose carefully, as there is no way to change it later!' }
                                            component={ Input }
                                            format={ value => formatUsername(value) }
                                            onPaste={ this.handleStop }
                                            onDrop={ e => this.handleStop(e) } />
                                    </div>
                                </div>
                                <div
                                    ref={ element => this.locationRef = element }
                                    className="ftu-prompt-category ftu-prompt-location">
                                    <div className="ftu-prompt-item ftu-prompt-location-item">
                                        <Field
                                            name="location"
                                            label="Location"
                                            type="text"
                                            tooltip={ 'Knowing your location will help us connect you with people & music specific to your area.' }
                                            component={ LocationInput }
                                            format={ value => formatLocation(value) }
                                            onPaste={ this.handleStop }
                                            onDrop={ e => this.handleStop(e) }
                                            onPlaceChange={ this.handlePlaceChange }
                                            ref={ element => this.locationFieldRef = element }
                                            isLocation />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="ftu-prompt-submit"
                            ref={ element => this.submitRef = element }>
                            <Button
                                type="submit"
                                btnType="info"
                                onClick={ handleSubmit(this.handleFormSubmit) }
                                isLoading={ submitting }
                                btnIcon=""
                                btnText={ 'Looks Good' } />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const FTUPWithReduxForm = reduxForm({
    form: 'firstTimeUser',
    validate,
    warn
})(FirstTimeUserPrompt);

export default connect(state => {
    return {
        initialValues: {
            displayName: state.user.displayName,
            username: state.user.username,
            location: state.user.location
        },
        displayName: state.user.displayName,
        username: state.user.username,
        avatar: state.user.avatar,
        location: state.user.location
    };
})(FTUPWithReduxForm);
