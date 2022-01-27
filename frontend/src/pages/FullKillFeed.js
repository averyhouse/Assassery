import React, { Component } from 'react';
import { connect } from 'react-redux';
import { auth, game } from '../actions';
import KillFeed from '../components/KillFeed';
import '../assets/css/Dashboard.scss';

class FullKillFeed extends Component {

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
            <div>
                <KillFeed kills={this.props.game.killfeed} />
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

export default connect(mapStateToProps, mapDispatchToProps)(FullKillFeed);
