import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth, game } from '../actions';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.scss';

class FullLeaderboard extends Component {

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
    }

    render() {
        return (
            <Leaderboard players={this.props.game.leaderboard} />
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

export default connect(mapStateToProps, mapDispatchToProps)(FullLeaderboard);
