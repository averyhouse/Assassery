import React, { Component } from 'react';
import connect from '../connection';
import KillFeed from '../components/KillFeed';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.css';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            killfeed: [], leaderboard: []
        };
    }

    componentDidMount() {
        fetch(
            "/api/game/dashboard/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => this.setState(data)
                )
            } else if (res.status >= 500) {
                console.log("Server Error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
        fetch(
            "/api/game/game/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => this.setState({...this.state, ...data})
                )
            } else if (res.status >= 500) {
                console.log("Server Error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
    }

    render() {
        return (
            <div>
                {this.state.hasOwnProperty('inprogress') && !this.state.inprogress && 
                    <h1 id="title">Winner: {this.state.winner}</h1>
                }
                <div class='flex-container'>
                    <div class='flex-element'>
                        <KillFeed kills={this.state.killfeed}/>
                    </div>
                    <div class='flex-element'>
                        <Leaderboard players={this.state.leaderboard}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(Dashboard);
