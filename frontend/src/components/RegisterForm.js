import React, { Component } from "react";
import { auth } from '../actions'
import { connect } from 'react-redux';
import "../assets/css/RegisterForm.scss";

import camera_icon from '../assets/images/camera_icon.png';

class RegisterForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            username: '',
            email: '',
            password: '',
            team: '',
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangeTeam = this.handleChangeTeam.bind(this);
        // this.handleChangePhoto = this.handleChangePhoto.bind(this);
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

    handleChangeTeam(event) {
        this.setState({ team: event.target.value });
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0
            && this.state.name.length > 0 && this.state.alias.length > 0;
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.register(this.state.name, this.state.email,
            this.state.password, this.state.username, this.state.photo, this.state.team);
    }

    togglePasswordVisibility() {
        if (document.getElementById("password").type == "text") {
            document.getElementById("password").type = "password";
        } else {
            document.getElementById("password").type = "text";
        }
    }

    // handleChangePhoto(event) {
    //     var file = event.target.files[0];
    //     this.setState({ photo: file });
    //     var reader = new FileReader();
    //     reader.onload = (e) => {
    //         document.getElementById("photo").src = e.target.result;
    //     }
    //     reader.readAsDataURL(file);
    // }

    render() {
        return (
            <div class="outer">
                <div class="middle">
                    <div class="inner">
                        <div class="registerForm">
                            <h1 id="registerTitle">Register</h1>
                            <form onSubmit={this.handleSubmit} enctype="multipart/form-data">
                                {/* <div class="image-form">
                                    <label>
                                        <div class="image-upload">
                                            <label for="file-input">
                                                <img
                                                    id="photo"
                                                    alt={"profile picture"}
                                                    src={this.state.photo}
                                                />
                                            </label>
                                            <input
                                                id="file-input"
                                                type="file"
                                                name="id-photo"
                                                accept="image/png,image/jpg,image/jpeg,image/gif"
                                                capture="camera"
                                                onChange={this.handleChangePhoto}
                                            />
                                        </div>
                                    </label>
                                    {this.props.errors.find(obj => obj.field == 'non_field_errors') &&
                                        <div class="error">{this.props.errors.find(obj => obj.field == 'non_field_errors').message}.</div>
                                    }<br />
                                </div> */}
                                <div class="text-form">
                                    <label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={this.state.name}
                                            placeholder="Name"
                                            onChange={this.handleChangeName}
                                        />
                                    </label>
                                    {this.props.errors.find(obj => obj.field == 'name') &&
                                        <div class="error">{this.props.errors.find(obj => obj.field == 'name').message}</div>
                                    }<br />
                                    <label>
                                        <input
                                            id="username"
                                            type="text"
                                            value={this.state.username}
                                            placeholder="Display name"
                                            onChange={this.handleChangeUsername}
                                        />
                                    </label>
                                    {this.props.errors.find(obj => obj.field == 'username') &&
                                        <div class="error">{this.props.errors.find(obj => obj.field == 'username').message}</div>
                                    }<br />
                                    <label>
                                        <input
                                            id="team"
                                            type="text"
                                            value={this.state.team}
                                            placeholder="Team name (CASE + SPACE + SYMBOL SENSTIVE)"
                                            onChange={this.handleChangeTeam}
                                        />
                                    </label>
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
                                    }<br />
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
                                </div>
                                <input type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>
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
        register: (name, email, password, username, photo, team) =>
            dispatch(auth.register(name, email, password, username, photo, team)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
