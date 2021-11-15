import React, {Component} from 'react';
import connect from '../connection';
import QRCapture from '../components/QRCapture';

class QRScanner extends Component {
    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        return (
            <div class="wrapper">
                <QRCapture />
            </div>
        );
    }
}

export default connect(QRScanner);