import React, {Component} from 'react';
import LoginForm from '../components/LoginForm';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import connect from '../connection';

class Login extends Component {
    render() {
        return (
            <div>
                <LoginForm/>
                <Link to={`/register`}>register</Link>
            </div>
        );
    }
}

export default connect(Login);