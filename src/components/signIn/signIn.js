import React, {Component} from 'react';
import googleApi from "../../util/googleApi";
import './signIn.css';

class SignIn extends Component {
    render() {
        return (
            <div className="sign-in">
                <div className="sign-in__title-section">
                    <h1 className="h1">Sign In</h1>
                    <div>Using your Gmail credentials</div>
                </div>
                <button className="button button--primary button--large sign-in__submit" onClick={googleApi.signIn}>Sign in</button>
            </div>
        );
    }
}

export default SignIn;
