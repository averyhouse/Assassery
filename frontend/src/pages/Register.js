import React, {Component} from 'react';
import RegisterForm from '../components/RegisterForm';
import connect from '../connection';

class Register extends Component {
    render() {
        return (
            <RegisterForm/>
        );
    }
}

export default connect(Register);