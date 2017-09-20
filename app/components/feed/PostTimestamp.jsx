import React, { Component } from 'react';
import moment from 'moment';
import {
    TweenLite,
    Power1
} from 'gsap';

class PostTimestamp extends Component {

    componentWillMount(){
        this.setState({
            timeStamp: this.processTimestamp()
        });
    }

    componentDidMount(){
        this.interval = setInterval(this.updateTimestamp, 1000);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.timeStamp !== this.state.timeStamp){
            TweenLite.from(this.timeStampRef, 0.5, {
                ease: Power1.easeOut,
                opacity: 0
            });
        }
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }

    processTimestamp(){
        const timeStamp = this.props.editedAt || this.props.timeStamp;
        const sameOrBefore = moment().subtract(3, 'days').isSameOrBefore(moment(timeStamp, 'LLLL'));
        if (sameOrBefore){
            return moment(timeStamp, 'LLLL').fromNow();
        }

        return timeStamp;
    }

    updateTimestamp(){
        this.setState({
            timeStamp: this.processTimestamp()
        });
    }

    render(){

        const { edited } = this.props;
        const { timeStamp } = this.state;

        const renderTimestamp = () => {
            if (edited){
                return `Edited ${ timeStamp }`;
            }

            return timeStamp;
        };

        return (
            <div
                ref={ element => this.timeStampRef = element }
                className="tonal-post-timestamp">
                { renderTimestamp() }
            </div>
        );
    }
}

export default PostTimestamp;
