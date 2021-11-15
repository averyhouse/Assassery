import React, { Component } from "react";
import { connect } from 'react-redux';
import QRCode from 'qrcode.react';

class QRDisplay extends Component {
    render() {
        return (
            <div>
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
