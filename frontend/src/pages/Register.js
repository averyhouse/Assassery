import React, { Component } from 'react';
import { BrowserRouter as Link, Redirect } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import connect from '../connection';

class Register extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <RegisterForm />
                <Link to={`/login`}>login</Link>
            </div>
        );
    }
}

export default connect(Register);
