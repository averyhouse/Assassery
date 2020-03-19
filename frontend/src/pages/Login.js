import React, { Component } from 'react';
import LoginForm from '../components/LoginForm';
import { BrowserRouter as Link, Redirect } from 'react-router-dom';
import connect from '../connection';

class Login extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <LoginForm />
                <Link to={`/register`}>register</Link>
            </div>
        );
    }
}

export default connect(Login);
