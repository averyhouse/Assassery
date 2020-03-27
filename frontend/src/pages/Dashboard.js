import React, { Component } from 'react';
import connect from '../connection';
import KillFeed from '../components/KillFeed';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.css';

class Dashboard extends Component {
    render() {
        return (
            <div class='flex-container'>
                <div class='flex-element'><KillFeed /></div>
                <div class='flex-element'><Leaderboard /></div>
            </div>
        );
    }
}

export default connect(Dashboard);
