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

        // TODO: change to name, when the migration is over, we just leaving it
        // "username" (which is actually name in backend code, but I don't feel
        // like making a new field) for now.
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

    isKillPending(in_kf, confirmed) {
        return in_kf && !confirmed;
    }

    renderTableData() {
        return this.props.team.members.map((player, index) => {
            const { name, dead, in_kf, confirmed } = player
            return (
                <tr key={name}>
                    <td>{name}</td>
                    <td>{dead && <button class="kill-button-dead">Already dead</button>}
                        {!dead && this.isKillPending(in_kf, confirmed) &&
                            <button class="kill-button-dead">Pending</button>}
                        {!dead && !this.isKillPending(in_kf, confirmed) && !this.props.dead &&
                            <button onClick={() => this.setState({ showKillModal: true, targetName: name })} class="kill-button-alive">I have killed them</button>}
                        {!dead && !this.isKillPending(in_kf, confirmed) && this.props.dead &&
                            <button class="kill-button-dead">No</button>
                        }
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
                    confirm={() => { this.handleKill(this.state.targetName); this.setState({ showKillModal: false }) }}
                    handleChangeMessage={this.handleChangeMessage}
                    message={this.state.message}
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
