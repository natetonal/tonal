import React from 'react';
import numeral from 'numeral';
import {
    TweenMax,
    Back
} from 'gsap';

export const UserPreview = React.createClass({

    componentDidMount(){
        const { countsArr } = this.props;
        if (countsArr.every(name => this[`${ name }Ref`])){
            const refs = countsArr.map(name => this[`${ name }Ref`]);
            TweenMax.staggerFrom(refs, 0.5, {
                ease: Back.easeOut.config(1.5),
                opacity: 0,
                y: 50
            }, 0.15);
        }
    },

    render(){

        const {
            user,
            pos,
            relationship,
            followUser,
            countsArr,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        if (!user){
            return (
                <div
                    ref={ element => this.previewElement = element }
                    className="user-preview"
                    style={ pos }
                    onMouseEnter={ onMouseEnter() }
                    onMouseLeave={ onMouseLeave() }>
                    <div className="user-preview-does-not-exist">
                        <i className="fa fa-meh-o" aria-hidden="true" />
                        This user does not exist.
                    </div>
                </div>
            );
        }

        const formatNumber = num => {

            if (!num){ return 0; }

            if (num.toString().length > 5){
                return numeral(num).format('0a');
            }

            return numeral(num).format('0,0');
        };

        const renderRelationshipStatus = () => {
            if (relationship === 'favorites'){
                return <div className="user-preview-follow-action"><i className="fa fa-heart" aria-hidden="true" /> Favorites</div>;
            }

            if (relationship === 'following'){
                return <div className="user-preview-follow-action"><i className="fa fa-check-circle" aria-hidden="true" /> Following</div>;
            }

            if (relationship === 'none'){
                return (
                    <div className="user-preview-follow-action" onClick={ () => followUser(user.uid, user.username, user.displayName) }>
                        <i className="fa fa-user-plus" aria-hidden="true" /> Follow
                    </div>
                );
            }

            return '';
        };

        const renderCountLabels = () => {
            return countsArr.map(name => {
                return (
                    <div
                        key={ `userPreviewLabel_${ name }` }
                        ref={ element => this[`${ name }Ref`] = element }
                        className="user-preview-friendship">
                        <div className="user-preview-friendship-label">
                            { name }
                        </div>
                        <div className="user-preview-friendship-count">
                            { formatNumber(user[`${ name }Count`]) }
                        </div>
                    </div>
                );
            });
        };

        return (
            <div
                ref={ element => this.previewElement = element }
                className="user-preview"
                style={ pos }
                onMouseEnter={ onMouseEnter() }
                onMouseLeave={ onMouseLeave() }>
                { renderRelationshipStatus() }
                <div className="user-preview-top">
                    <div className="user-preview-avatar">
                        <img
                            src={ user.avatar }
                            alt={ user.displayName } />
                    </div>
                    <div className="user-preview-info">
                        <div className="user-preview-name">
                            { user.displayName }
                        </div>
                        <div className="user-preview-username">
                            @{ user.username }
                        </div>
                        <div className="user-preview-location">
                            <i className="fa fa-location-arrow" aria-hidden="true" />
                            { ` ${ user.location }` }
                        </div>
                    </div>
                </div>
                <div className="user-preview-bottom">
                    { renderCountLabels() }
                </div>
            </div>
        );
    }

});

export default UserPreview;
