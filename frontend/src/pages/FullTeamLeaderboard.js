import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth, game } from '../actions';
import TeamLeaderboard from '../components/TeamLeaderboard';
import '../assets/css/Dashboard.scss';

class FullTeamLeaderboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaderboard: []
        };
    }

    componentDidMount() {
        this.props.loadUser();
        this.props.loadGame();
        this.props.loadDashboard();
        this.props.loadTeamLeaderboard();
    }

    render() {
        return (
            <TeamLeaderboard teams={this.props.game.teamLeaderboard} />
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
        },
        loadTeamLeaderboard: () => {
            return dispatch(game.loadTeamLeaderboard());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FullTeamLeaderboard);
