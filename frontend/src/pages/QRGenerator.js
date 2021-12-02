import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { game } from '../actions';
import QRDisplay from '../components/QRDisplay';

class QRGenerator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fail: false
        };
    }

    componentDidMount() {
        this.props.loadGame();
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.props.token}`
        };
        fetch(
            "/api/game/assassin/", {
            method: "GET",
            headers: headers,
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => {
                        if (!data.assassin.dead) {
                            this.setState({loading: false, fail: false})
                        }
                    }
                )
            } else {
                this.setState({loading: false, fail: true})
            }
        })
    }

    render() {
        if (!this.props.isAuthenticated || !this.props.game.inProgress || this.state.fail) {
            return <Redirect to="/" />
        }
        if (this.state.loading || this.props.game.isLoading) {
            return <em>Loading...</em>;
        }
        return (
            <div class="wrapper">
                <QRDisplay token={this.props.token} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated,
        game: state.game
    };
}

const mapDispatchToProps = dispatch => {
    return {
        loadGame: () => {
            return dispatch(game.loadGame());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRGenerator);