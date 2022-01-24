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
        this.props.loadDashboard();
    }

    render() {
        console.log(this.props.game);
        return (
            <div>
                {!this.props.game.inProgress &&
                    <h1 id="title">Winner: {this.props.game.winner}</h1>
                }
                <div class='flex-container'>
                    <div class='flex-element'>
                        <KillFeed kills={this.props.game.killfeed} />
                    </div>
                    <div class='flex-element'>
                        <Leaderboard players={this.props.game.leaderboard} />
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
        },
        loadDashboard: () => {
            return dispatch(game.loadDashboard());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
