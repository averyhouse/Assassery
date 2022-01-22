import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth, game } from '../actions';
import KillFeed from '../components/KillFeed';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.scss';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            killfeed: [], leaderboard: []
        };
    }

    componentDidMount() {
        this.props.loadUser();
        this.props.loadGame();
        fetch(
            "/api/game/dashboard/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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
    }

    render() {
        return (
            <div>
                {!this.props.game.inProgress &&
                    <h1 id="title">Winner: {this.props.game.winner}</h1>
                }
                <div class='flex-container'>
                    <div class='flex-element'>
                        <KillFeed kills={this.state.killfeed} />
                    </div>
                    <div class='flex-element'>
                        <Leaderboard players={this.state.leaderboard} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        game: state.game
    };
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        loadGame: () => {
            return dispatch(game.loadGame());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
