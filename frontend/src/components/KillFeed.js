import React, { Component } from 'react';
import '../assets/css/KillFeed.scss';

export default class KillFeed extends Component {

    renderTableHeader() {
        let header = Object.keys({ timestamp: '', message: '' })
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                <h1 id='title'>Kill Feed</h1>
                <table id='kills'>
                    <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }

    renderTableData() {
        return this.props.kills.map((kill, index) => {
            const { timestamp, message, confirmed, legit_kill } = kill
            return (
                <>
                    <tr>
                        <td style={{lineHeight: '2px'}} colSpan={2}>&nbsp;</td>
                    </tr>
                    {confirmed && legit_kill && 
                    <tr key={timestamp}>
                        <td>{timestamp}</td>
                        <td>{message}</td>
                    </tr>}
                </>
            )
        })
    }
}
