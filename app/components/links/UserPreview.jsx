import React from 'react';
import numeral from 'numeral';

export const UserPreview = React.createClass({

    render(){

        const {
            user,
            pos,
            relationship,
            followUser,
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
                return <div className="user-preview-follow-action"><i className="fa fa-check-circle" aria-hidden="true" /> Favorites</div>;
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
                    <div className="user-preview-friendship">
                        <div className="user-preview-friendship-label">
                            Followers
                        </div>
                        <div className="user-preview-friendship-count">
                            { formatNumber(user.followersCount) }
                        </div>
                    </div>
                    <div className="user-preview-friendship">
                        <div className="user-preview-friendship-label">
                            Following
                        </div>
                        <div className="user-preview-friendship-count">
                            { formatNumber(user.followingCount) }
                        </div>
                    </div>
                    <div className="user-preview-friendship">
                        <div className="user-preview-friendship-label">
                            Favorited By
                        </div>
                        <div className="user-preview-friendship-count">
                            { formatNumber(user.favoritedCount) }
                        </div>
                    </div>
                    <div className="user-preview-friendship">
                        <div className="user-preview-friendship-label">
                            Favorites
                        </div>
                        <div className="user-preview-friendship-count">
                            { formatNumber(user.favoritesCount) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default UserPreview;
