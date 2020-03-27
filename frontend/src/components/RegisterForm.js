import React, { Component } from "react";
import { auth } from '../actions'
import { connect } from 'react-redux';
import "../assets/css/RegisterForm.scss";

class RegisterForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            username: '',
            email: '',
            password: ''
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({ name: event.target.value });
    }

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0
            && this.state.name.length > 0 && this.state.alias.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.register(this.state.name, this.state.email,
            this.state.password, this.state.username);
    }

    render() {
        return (
            <div>
                <h1 id="registerTitle">Register</h1>
                <form onSubmit={this.handleSubmit}>
                    {/*this.props.errors.length > 0 && (
                        <ul>
                            {this.props.errors.map(error => (
                                <li key={error.field}>{error.message}</li>
                            ))}
                        </ul>
                            )*/}
                    <label>
                        Name:
                        <br />
                        <input type="text" value={this.state.name} onChange={this.handleChangeName} />
                    </label>
                    <br />
                    <label>
                        Username:
                        <br />
                        <input type="text" value={this.state.username} onChange={this.handleChangeUsername} />
                    </label>
                    <br />
                    <label>
                        Email:
                        <br />
                        <input type="text" value={this.state.email} onChange={this.handleChangeEmail} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <br />
                        <input type="password" value={this.state.password} onChange={this.handleChangePassword} />
                    </label>
                    <br />
                    <input type="submit" value="Submit" />
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
        register: (name, email, password, username) =>
            dispatch(auth.register(name, email, password, username)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
