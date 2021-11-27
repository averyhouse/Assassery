import React, { Component } from 'react';
import { BrowserRouter as Redirect } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import connect from '../connection'
import "../assets/css/RegisterForm.scss";


class Register extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div class="wrapper">
                <RegisterForm />
            </div>
        );
    }
}

export default connect(Register);
