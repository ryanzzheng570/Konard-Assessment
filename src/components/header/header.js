import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './header.css';
import logoImg from'../../img/logo.png';
import googleApi from "../../util/googleApi";

class Header extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool
    };

    render() {
        const {loggedIn} = this.props;

        return (
            <div className="header">
                <img className="header__logo"  src={logoImg} alt="logo"/>
                <div className="header__flex-spacer"/>
                {loggedIn === true && <button className="button button--default" onClick={googleApi.signOut}>Sign out</button>}
            </div>
        );
    }
}

export default Header;
