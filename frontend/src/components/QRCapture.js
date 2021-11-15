import React, { Component } from "react";
import { connect } from 'react-redux';
import QrReader from 'react-qr-reader';

class QRCapture extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            status: 'Scan',
            result: ''
        }
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleScan(data) {
        if (data) {
            this.setState({
                status: 'Captured',
                result: data
            });
        }
    }

    handleError(err) {
        console.error(err);
    }

    handleSubmit(event) {

    }

    render() {
        
        const previewStyle = {
            height: '50%',
            width: '50%',
            display: 'flex',
            justifyContent: "center"
        }

        const camStyle = {
            display: 'flex',
            justifyContent: "center",
        }
        
        return (
            <div>
                <div style = {camStyle}>
                    <QrReader
                        delay={100}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                    />
                </div>
                <p>
                    {this.state.status}
                </p>
                <form onSubmit={this.handleSubmit}>
                    <input type="submit" value="Assassinate" />
                </form>
            </div>
        );

    }
}

function decode(val) {
    let idx = 0;
    let result = ""
    while (idx < val.length) {
        strAscii = val.substring(idx, idx+3);
        intAscii = parseInt(strAscii);
        c = fromCharCode(intAscii);
        result += c;
    }
    return res;
}


export default connect()(QRCapture);