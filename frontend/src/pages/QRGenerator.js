import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import QRDisplay from '../components/QRDisplay';
import connect from '../connection';

class QRGenerator extends Component {
    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div class="wrapper">
                <QRDisplay />
            </div>
        );
    }
}

export default connect(QRGenerator);