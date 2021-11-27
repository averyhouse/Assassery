import React, { Component } from "react";
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';

class QRDisplay extends Component {

    render() {
        const style = {
            textAlign: "left",
            fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
        };

        return (
            <div>
                <h1 style={style}>QR Code</h1>
                <QRCode value={this.props.encodedUser} />
            </div>
        );
    }
}

function encode(val) {
    let res = "";
    for (const c of val) {
        res += String(c.charCodeAt()).padStart(3, "0");
    }
    return res;
}

const mapStateToProps = state => {
    let encodedUser = encode(state.auth.user.username);
    return {
        encodedUser: encodedUser
    };
}

export default connect(mapStateToProps)(QRDisplay);
