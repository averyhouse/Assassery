import React, {Component} from 'react';
import connect from '../connection';
import KillFeed from '../components/KillFeed';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.css';

class Dashboard extends Component {
    render() {
        return (
            <div class='flex-container'>
                <h1>Welcome {this.props.user}!</h1>
                <div class='flex-element'><KillFeed/></div>
                <div class='flex-element'><Leaderboard/></div>
            </div>
        );
    }
}

export default connect(Dashboard);