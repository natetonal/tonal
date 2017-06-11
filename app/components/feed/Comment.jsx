import React from 'react';

export const Comment = React.createClass({

    render(){

        const {
            displayName,
            avatar,
            message,
            likes,
            timeStamp
        } = this.props.data;

        const postNum = this.props.number;

        return (
            <div className={ `tonal-post-reply-${ postNum }` }>
                <div className={ `tonal-post-reply-menu-${ postNum }` }>
                    <i className="fa fa-angle-down" aria-hidden="true" />
                </div>
                <div className={ `tonal-post-reply-display-name-${ postNum }` }>
                    { displayName }
                </div>
                <div className={ `tonal-post-reply-avatar-${ postNum }` }>
                    <img
                        src={ avatar }
                        alt={ displayName } />
                </div>
                <div className={ `tonal-post-reply-message-${ postNum }` }>
                    { message }
                </div>
                <div className={ `tonal-post-reply-info-${ postNum }` }>
                    <div className={ `tonal-post-reply-likes-${ postNum }` }>
                        <i className="fa fa-bolt" aria-hidden="true" />
                        { likes }
                    </div>
                    <div className={ `tonal-post-reply-timestamp-${ postNum }` }>
                        { timeStamp }
                    </div>
                </div>
            </div>
        );

    }
});

export default Comment;
