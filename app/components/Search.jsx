import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';

export const Search = React.createClass({

    toggleSearch(event){
        const { dispatch, isOpen } = this.props;
        dispatch(actions.toggleSearch());
        if(isOpen){ this.refs.searchBox.value = ''; }
    },

    render(){

        const { isOpen } = this.props;

        const columnClass = () => {
            if(isOpen){
                return "animated fadeInUp 1sec dummy-column";
            } else {
                return "dummy-column";
            }
        };

        return(
            <div ref="morphsearch" className={`morphsearch${ isOpen ? " open" : ""}`}>
        		<form className="morphsearch-form">
        			<input className="morphsearch-input"
                            ref="searchBox"
                            onFocus={ !isOpen ? this.toggleSearch : "" }
                            type="search"
                            placeholder={ !isOpen ? String.fromCharCode("0xf002") : '' } />
        			<button className="morphsearch-submit" ref="submitBtn" type="submit"><i className="material-icons">search</i></button>
        		</form>
        		<div className="morphsearch-content clearfix">
        			<div className={columnClass()}>
        				<h2>People</h2>
                        <a className="dummy-media-object" href="http://twitter.com/SaraSoueidan">
        					<img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G" alt="Sara Soueidan"/>
        					<h3>Sara Soueidan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://twitter.com/rachsmithtweets">
        					<img className="round" src="http://0.gravatar.com/avatar/48959f453dffdb6236f4b33eb8e9f4b7?s=50&d=identicon&r=G" alt="Rachel Smith"/>
        					<h3>Rachel Smith</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/peterfinlan">
        					<img className="round" src="http://0.gravatar.com/avatar/06458359cb9e370d7c15bf6329e5facb?s=50&d=identicon&r=G" alt="Peter Finlan"/>
        					<h3>Peter Finlan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/pcridesagain">
        					<img className="round" src="http://1.gravatar.com/avatar/db7700c89ae12f7d98827642b30c879f?s=50&d=identicon&r=G" alt="Patrick Cox"/>
        					<h3>Patrick Cox</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/twholman">
        					<img className="round" src="http://0.gravatar.com/avatar/cb947f0ebdde8d0f973741b366a51ed6?s=50&d=identicon&r=G" alt="Tim Holman"/>
        					<h3>Tim Holman</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/shaund0na">
        					<img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G" alt="Shaun Dona"/>
        					<h3>Shaun Dona</h3>
        				</a>
                        <a className="dummy-media-object" href="http://twitter.com/SaraSoueidan">
        					<img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G" alt="Sara Soueidan"/>
        					<h3>Sara Soueidan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://twitter.com/rachsmithtweets">
        					<img className="round" src="http://0.gravatar.com/avatar/48959f453dffdb6236f4b33eb8e9f4b7?s=50&d=identicon&r=G" alt="Rachel Smith"/>
        					<h3>Rachel Smith</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/peterfinlan">
        					<img className="round" src="http://0.gravatar.com/avatar/06458359cb9e370d7c15bf6329e5facb?s=50&d=identicon&r=G" alt="Peter Finlan"/>
        					<h3>Peter Finlan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/pcridesagain">
        					<img className="round" src="http://1.gravatar.com/avatar/db7700c89ae12f7d98827642b30c879f?s=50&d=identicon&r=G" alt="Patrick Cox"/>
        					<h3>Patrick Cox</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/twholman">
        					<img className="round" src="http://0.gravatar.com/avatar/cb947f0ebdde8d0f973741b366a51ed6?s=50&d=identicon&r=G" alt="Tim Holman"/>
        					<h3>Tim Holman</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/shaund0na">
        					<img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G" alt="Shaun Dona"/>
        					<h3>Shaun Dona</h3>
        				</a>
        			</div>
        			<div className={columnClass()}>
        				<h2>Popular</h2>
                        <a className="dummy-media-object" href="http://twitter.com/SaraSoueidan">
        					<img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G" alt="Sara Soueidan"/>
        					<h3>Sara Soueidan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://twitter.com/rachsmithtweets">
        					<img className="round" src="http://0.gravatar.com/avatar/48959f453dffdb6236f4b33eb8e9f4b7?s=50&d=identicon&r=G" alt="Rachel Smith"/>
        					<h3>Rachel Smith</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/peterfinlan">
        					<img className="round" src="http://0.gravatar.com/avatar/06458359cb9e370d7c15bf6329e5facb?s=50&d=identicon&r=G" alt="Peter Finlan"/>
        					<h3>Peter Finlan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/pcridesagain">
        					<img className="round" src="http://1.gravatar.com/avatar/db7700c89ae12f7d98827642b30c879f?s=50&d=identicon&r=G" alt="Patrick Cox"/>
        					<h3>Patrick Cox</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/twholman">
        					<img className="round" src="http://0.gravatar.com/avatar/cb947f0ebdde8d0f973741b366a51ed6?s=50&d=identicon&r=G" alt="Tim Holman"/>
        					<h3>Tim Holman</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/shaund0na">
        					<img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G" alt="Shaun Dona"/>
        					<h3>Shaun Dona</h3>
        				</a>
        			</div>
                    <div className={columnClass()}>
        				<h2>Recent</h2>
                        <a className="dummy-media-object" href="http://twitter.com/SaraSoueidan">
        					<img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G" alt="Sara Soueidan"/>
        					<h3>Sara Soueidan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://twitter.com/rachsmithtweets">
        					<img className="round" src="http://0.gravatar.com/avatar/48959f453dffdb6236f4b33eb8e9f4b7?s=50&d=identicon&r=G" alt="Rachel Smith"/>
        					<h3>Rachel Smith</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/peterfinlan">
        					<img className="round" src="http://0.gravatar.com/avatar/06458359cb9e370d7c15bf6329e5facb?s=50&d=identicon&r=G" alt="Peter Finlan"/>
        					<h3>Peter Finlan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/pcridesagain">
        					<img className="round" src="http://1.gravatar.com/avatar/db7700c89ae12f7d98827642b30c879f?s=50&d=identicon&r=G" alt="Patrick Cox"/>
        					<h3>Patrick Cox</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/twholman">
        					<img className="round" src="http://0.gravatar.com/avatar/cb947f0ebdde8d0f973741b366a51ed6?s=50&d=identicon&r=G" alt="Tim Holman"/>
        					<h3>Tim Holman</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/shaund0na">
        					<img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G" alt="Shaun Dona"/>
        					<h3>Shaun Dona</h3>
        				</a>
        			</div>
                    <div className={columnClass()}>
        				<h2>Coming Soon</h2>
                        <a className="dummy-media-object" href="http://twitter.com/SaraSoueidan">
        					<img className="round" src="http://0.gravatar.com/avatar/81b58502541f9445253f30497e53c280?s=50&d=identicon&r=G" alt="Sara Soueidan"/>
        					<h3>Sara Soueidan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://twitter.com/rachsmithtweets">
        					<img className="round" src="http://0.gravatar.com/avatar/48959f453dffdb6236f4b33eb8e9f4b7?s=50&d=identicon&r=G" alt="Rachel Smith"/>
        					<h3>Rachel Smith</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/peterfinlan">
        					<img className="round" src="http://0.gravatar.com/avatar/06458359cb9e370d7c15bf6329e5facb?s=50&d=identicon&r=G" alt="Peter Finlan"/>
        					<h3>Peter Finlan</h3>
        				</a>
        				<a className="dummy-media-object" href="http://www.twitter.com/pcridesagain">
        					<img className="round" src="http://1.gravatar.com/avatar/db7700c89ae12f7d98827642b30c879f?s=50&d=identicon&r=G" alt="Patrick Cox"/>
        					<h3>Patrick Cox</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/twholman">
        					<img className="round" src="http://0.gravatar.com/avatar/cb947f0ebdde8d0f973741b366a51ed6?s=50&d=identicon&r=G" alt="Tim Holman"/>
        					<h3>Tim Holman</h3>
        				</a>
        				<a className="dummy-media-object" href="https://twitter.com/shaund0na">
        					<img className="round" src="http://1.gravatar.com/avatar/9bc7250110c667cd35c0826059b81b75?s=50&d=identicon&r=G" alt="Shaun Dona"/>
        					<h3>Shaun Dona</h3>
        				</a>
        			</div>
        		</div>
        		<span className="morphsearch-close" onClick={ this.toggleSearch } ref="closeBtn"></span>
        	</div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.searchIsOpen };
})(Search);
