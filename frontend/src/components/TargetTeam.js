import React, { Component } from 'react';
import Team from './Team.js';
import '../assets/css/Team.scss';
import { connect } from 'react-redux';

export class TargetTeam extends Team {

    constructor(props) {
        super(props);
        this.handleKill = this.handleKill.bind(this);
        this.state = { test: 0 }
    }

    handleKill(alias) {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.props.token}`
        };

        let data = {
            killer_username: this.props.username,
            victim_username: alias
        };

        // if (this.state.message) {
        //     data["message"] = this.state.message;
        // }

        fetch(
            "/api/game/kill/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
        window.location.reload(false);
    }

    renderTableData() {
        return this.props.team.members.map((player, index) => {
            const { alias, name, dead } = player
            return (
                <tr key={name}>
                    <td>{alias}</td>
                    <td>{name}</td>
                    <td>{dead && <button class="kill-button-dead">Already dead</button>}
                        {!dead && <button onClick={_ => this.handleKill(alias)} class="kill-button-alive">I have killed them</button>}</td>
                </tr >
            )
        })
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.user.username
    };
}

export default connect(mapStateToProps)(TargetTeam);
