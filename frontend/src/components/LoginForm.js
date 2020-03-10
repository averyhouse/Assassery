import React, {Component} from "react";
import "../assets/css/LoginForm.css";

export default class LoginForm extends Component {

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
        alert(this.state.email + " " + this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <h1 id='title'>Login</h1>
                <form onSubmit={this.handleSubmit}>
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