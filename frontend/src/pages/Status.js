import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import Team from '../components/Team';
import { connect } from 'react-redux';

class Status extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            fail: false
        };
    }

    componentDidMount() {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.props.token}`
        };
        fetch(
            "/api/game/status/", {
            method: "GET",
            headers: headers,
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => this.setState({...this.state, loading: false, ...data})
                )
            } else {
                this.setState({loading: false, fail: true})
            }
        })
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/" />
        }
        if (this.state.loading) {
            return <em>Loading...</em>;
        }
        if (this.state.fail) {
            return <Redirect to="/" />
        }
        return (
            <div class='flex-container'>
                <div class='flex-element'>
                    <Team relation="Your Team" team={this.state.team}/>
                </div>
                <div class='flex-element'>
                    <Team relation="Target Team" team={this.state.target}/>
                </div>
                <div class='flex-element'>
                    <Team relation="Hunter Team" team={this.state.hunter}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated
    };
}

export default connect(mapStateToProps)(Status);