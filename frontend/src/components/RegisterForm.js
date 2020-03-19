import React, {Component} from "react";
import "../assets/css/LoginForm.css";

export default class LoginForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            alias: '',
            email: '',
            password: ''
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeAlias = this.handleChangeAlias.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    handleChangeAlias(event) {
        this.setState({alias: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0
                && this.state.name.length > 0 && this.state.alias.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <div>
                <h1 id='title'>Register</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Name:
                        <br/>
                        <input type="text" value={this.state.name} onChange={this.handleChangeName}/>
                    </label>
                    <br/>
                    <label>
                        Alias:
                        <br/>
                        <input type="text" value={this.state.alias} onChange={this.handleChangeAlias}/>
                    </label>
                    <br/>
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