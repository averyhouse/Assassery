import React, {Component} from 'react';
import connect from '../connection';

class QRGenerator extends Component {
    render() {
        return (
            <div>QR!</div>
        );
    }
}

export default connect(QRGenerator);