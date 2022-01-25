import React, { Component } from 'react';
import Team from './Team.js';
import '../assets/css/Team.scss';
import { connect } from 'react-redux';
import KillModal from './KillModal.js';

export class TargetTeam extends Team {

    constructor(props) {
        super(props);
        this.handleKill = this.handleKill.bind(this);
        this.isKillPending = this.isKillPending.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.state = {
            showKillModal: false,
            message: "",
            targetAlias: null,
            targetName: null
        };
    }

    handleChangeMessage(event) {
        this.setState({ message: event.target.value });
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

        if (this.state.message) {
            data["message"] = this.state.message;
        } else {
            data["message"] = "splashing them with water.";
        }

        fetch(
            "/api/game/kill/", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        })
        window.location.reload(false);
    }

    isKillPending(alias) {
        return this.props.killfeed.some((kill) => kill.victim_username == alias && !kill.confirmed);
    }

    renderTableData() {
        return this.props.team.members.map((player, index) => {
            const { alias, name, dead } = player
            return (
                <tr key={name}>
                    <td>{alias}</td>
                    <td>{name}</td>
                    <td>{dead && <button class="kill-button-dead">Already dead</button>}
                        {!dead && !this.isKillPending(alias) && !this.props.dead &&
                            <button onClick={() => this.setState({ showKillModal: true, targetAlias: alias, targetName: name })} class="kill-button-alive">I have killed them</button>}
                        {!dead && !this.isKillPending(alias) && this.props.dead &&
                            <button class="kill-button-dead">No</button>
                        }
                        {!dead && this.isKillPending(alias) &&
                            <button class="kill-button-dead">Pending</button>}
                    </td>
                </tr >
            )
        })
    }

    render() {
        return (
            <div>
                {super.render()}
                {this.state.showKillModal && <KillModal
                    exit={() => this.setState({ showKillModal: false })}
                    confirm={() => { this.handleKill(this.state.targetAlias); this.setState({ showKillModal: false }) }}
                    handleChangeMessage={this.handleChangeMessage}
                    message={this.state.message}
                    targetAlias={this.state.targetAlias}
                    targetName={this.state.targetName}
                >
                </KillModal>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.user.username,
        killfeed: state.game.killfeed
    };
}

export default connect(mapStateToProps)(TargetTeam);
