import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import { BrowserRouter as Link, Redirect } from 'react-router-dom';
import connect from '../connection';
import "../assets/css/LoginForm.scss";

class Login extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div class="wrapper">
                <LoginForm />
            </div>
        );
    }
}

export default connect(Login);
