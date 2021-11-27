import React, { Component } from 'react';
import '../assets/css/Leaderboard.scss';

export default class Leaderboard extends Component {

    renderTableHeader() {
        let header = Object.keys({alias: '', kills: '', deaths: ''})
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                <h1 id='title'>Leaderboard</h1>
                <table id='players'>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderTableData() {
        return this.props.players.map((player, index) => {
            const { alias, kills, deaths } = player
            return (
                <tr key={alias}>
                    <td>{alias}</td>
                    <td>{kills}</td>
                    <td>{deaths}</td>
                </tr>
            )
        })
    }
}
