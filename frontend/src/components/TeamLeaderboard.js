import React, { Component } from 'react';
import '../assets/css/Leaderboard.scss';

export default class Leaderboard extends Component {

    renderTableHeader() {
        let header = Object.keys({ name: '', kills: '', deaths: '', killscore: '' })
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                <h1 id='title'>Team Leaderboard</h1>
                <table id='teams'>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderTableData() {
        console.log(this.props.teams)
        return this.props.teams.map((team, index) => {
            const { name, kills, deaths, ratio } = team
            return (
                <tr key={name}>
                    <td>{name}</td>
                    <td>{kills}</td>
                    <td>{deaths}</td>
                    <td>{ratio}</td>
                </tr>
            )
        })
    }
}
