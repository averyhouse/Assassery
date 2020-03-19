import React, {Component} from 'react';
import connect from '../connection';

class QRScanner extends Component {
    render() {
        return (
            <div>Scan!</div>
        );
    }
}

export default connect(QRScanner);