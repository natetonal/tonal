import React from 'react';
import numeral from 'numeral';

export const UserPreview = React.createClass({

    render(){

        const {
            user,
            pos,
            onMouseEnter,
            onMouseLeave
        } = this.props;

        const formatNumber = num => {
            if (num.toString().length > 5){
                return numeral(num).format('0a');
            }

            return numeral(num).format('0,0');
        };

        const renderFollowStatus = () => {
            if (user.currentlyFollowed){
                return (
                    <span>
                        <i className="fa fa-check" aria-hidden="true" /> Following
                    </span>
                );
            }

            return (
                <span>
                    <i className="fa fa-user-plus" aria-hidden="true" /> Follow
                </span>
            );
        };

        return (
            <div
                ref={ element => this.previewElement = element }
                className="user-preview"
                style={ pos }
                onMouseEnter={ onMouseEnter() }
                onMouseLeave={ onMouseLeave() }>
                <div className="user-preview-follow-action">
                    { renderFollowStatus() }
                </div>
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
                    <div className="user-preview-followers">
                        <div className="user-preview-followers-label">
                            Followers
                        </div>
                        <div className="user-preview-followers-count">
                            { formatNumber(user.followerCount) }
                        </div>
                    </div>
                    <div className="user-preview-following">
                        <div className="user-preview-following-label">
                            Following
                        </div>
                        <div className="user-preview-following-count">
                            { formatNumber(user.followingCount) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default UserPreview;
