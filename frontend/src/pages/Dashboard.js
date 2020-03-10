import React, {Component} from 'react';
import KillFeed from '../components/KillFeed';
import Leaderboard from '../components/Leaderboard';
import '../assets/css/Dashboard.css';

export default class Dashboard extends Component {
    render() {
        return (
            <div class='flex-container'>
                <div class='flex-element'><KillFeed/></div>
                <div class='flex-element'><Leaderboard/></div>
            </div>
        );
    }
}