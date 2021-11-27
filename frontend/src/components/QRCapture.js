import React, { Component } from "react";
import { connect } from 'react-redux';
import QrReader from 'react-qr-reader';
import "../assets/css/QRCapture.scss";

class QRCapture extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            status: 'Scan',
            message: '',
            result: '075'
        }
        this.handleScan = this.handleScan.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
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
        console.log(err);
    }

    handleChangeMessage(event) {
        this.setState({ message: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.props.token}`
        };

        let data = {
            killer_username: this.props.username,
            victim_username: decode(this.state.result)
        }

        console.log(data)

        if (this.state.message) {
            data[message] = this.state.message
        }
        
        fetch(
            "/api/game/kill/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status === 200) {
                this.setState({
                    status: 'Kill Successful',
                    message: '',
                    result: ''
                });
            } else if (res.status === 405) {
                res.json().then(
                    data => this.setState({
                        status: data.message
                    })
                );
            } else if (res.status >= 500) {
                console.log("Server error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
    }

    render() {

        const measure = "max(min(10cm, 75%), 30%)";

        const camStyle = {
            display: 'flex',
            justifyContent: "center"
        };

        const previewSyle = {
            height: measure,
            width: measure,
            display: 'flex',
            justifyContent: "center"
        };

        const statusStyle = {
            width: measure,
            margin: "0.25cm auto",
            border: "1px solid $tablebordergray"
        };
        
        return (
            <div>
                <h1 id="assassinateTitle">Assassinate</h1>
                <p>
                    First, scan your victim's QR code. Check that the status is "Captured." Then enter a kill message to be shown on the kill feed. The kill message defaults to "spraying them with water."
                </p>
                <div style={camStyle}>
                    <QrReader id="qrreader"
                        delay={100}
                        style={previewSyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                    />
                </div>
                <p style={statusStyle}>
                    Status: {this.state.status}
                </p>
                <form onSubmit={this.handleSubmit}>
                    <input
                        id="message"
                        type="text"
                        value={this.state.message}
                        placeholder="Kill Message"
                        onChange={this.handleChangeMessage}
                    />
                    <input type="submit" value="Assassinate" />
                </form>
            </div>
        );

    }
}

function decode(val) {
    // handle bad inputs
    val = val.trim();
    let badChars = ['-', '.', 'e', 'E'];
    let fail1 = val.length % 3 != 0;
    let fail2 = isNaN(val);
    let fail3 = badChars.some(char=>val.includes(char));
    if (fail1 || fail2 || fail3) {
        return "";
    }

    // decode inputs with valid encoding
    let idx = 0;
    let result = "";
    while (idx < val.length) {
        let strAscii = val.substring(idx, idx+3);
        let intAscii = parseInt(strAscii);
        let c = String.fromCharCode(intAscii);
        result += c;
        idx += 3;
    }

    return result;
}

const mapStateToProps = state => {
    return {
        username: state.auth.user.username,
    };
}

export default connect(mapStateToProps)(QRCapture);