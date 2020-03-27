import React, { Component } from "react";
import { auth } from '../actions'
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import "../assets/css/LoginForm.scss";

export class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        };
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.login(this.state.email, this.state.password);
        if (this.state.remember) {
            document.cookie = `token=${this.props.token}; path=/`;
        }
    }

    togglePasswordVisibility() {
        if (document.getElementById("password").type == "text") {
            document.getElementById("password").type = "password";
        } else {
            document.getElementById("password").type = "text";
        }
    }

    render() {
        return (
            <div class="loginForm">
                <h1 id="loginTitle">Sign in</h1>
                <p>
                    Don't have an account? <Link to="/register">Create one.</Link>
                </p>
                <form onSubmit={this.handleSubmit}>
                    {this.props.errors.find(obj => obj.field == 'non_field_errors') &&
                        <div class="error">{this.props.errors.find(obj => obj.field == 'non_field_errors').message}.</div>
                    } <br />
                    <label>
                        <input
                            id="email"
                            type="text"
                            value={this.state.email}
                            placeholder="Caltech Email"
                            title="[name]@caltech.edu"
                            onChange={this.handleChangeEmail}
                        />
                    </label>
                    {this.props.errors.find(obj => obj.field == 'email') &&
                        <div class="error">{this.props.errors.find(obj => obj.field == 'email').message}</div>
                    }
                    <br />
                    <label>
                        <input
                            id="password"
                            type="password"
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.handleChangePassword}
                        />
                    </label>
                    {this.props.errors.find(obj => obj.field == 'password') &&
                        <div class="error">{this.props.errors.find(obj => obj.field == 'password').message}</div>
                    }<br />
                    <label>
                        <input type="checkbox" onChange={this.togglePasswordVisibility} />Show password
                    </label>
                    <input type="submit" value="Sign in" />
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let errors = [];
    if (state.auth.errors) {
        errors = Object.keys(state.auth.errors).map(field => {
            return { field, message: state.auth.errors[field] };
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
