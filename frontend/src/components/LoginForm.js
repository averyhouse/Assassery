import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import { auth } from '../actions'
import { connect } from 'react-redux';
import "../assets/css/LoginForm.css";

export class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        };
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.login(this.state.email, this.state.password);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <h1 id='title'>Login</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.props.errors.length > 0 && (
                        <ul>
                            {this.props.errors.map(error => (
                                <li key={error.field}>{error.message}</li>
                            ))}
                        </ul>
                    )}
                    <label>
                        Email:
                        <br/>
                        <input type="text" value={this.state.email} onChange={this.handleChangeEmail}/>
                    </label>
                    <br/>
                    <label>
                        Password:
                        <br/>
                        <input type="password" value={this.state.password} onChange={this.handleChangePassword}/>
                    </label>
                    <br/>
                    <input type="submit" value="Submit"/>
                </form>

            </div>
        );
    }
}

const mapStateToProps = state => {
    let errors = [];
    if (state.auth.errors) {
        errors = Object.keys(state.auth.errors).map(field => {
            return {field, message: state.auth.errors[field]};
        });
    }
    return {
        errors,
        isAuthenticated: state.auth.isAuthenticated
    };
}
  
const mapDispatchToProps = dispatch => {
    return {
        login: (username, password) => {
            return dispatch(auth.login(username, password));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);