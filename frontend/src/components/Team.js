import React, { Component } from 'react';
import '../assets/css/Team.scss';

export default class Team extends Component {

    renderTableHeader() {
        let header = Object.keys({ alias: '', name: '', dead: '' })
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableHeader2() {
        let header = Object.keys({ name: '', dead: '' })
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                {this.props.team != null &&
                    <div>
                        <h1 id='title'>{this.props.relation}: {this.props.team.name} </h1>
                        {this.props.showKda &&
                            <h2 class="subtitle">Kills: {this.props.kills}</h2>}
                        {this.props.showKda &&
                            <h2 class="subtitle">Deaths: {this.props.deaths}</h2>}
                        <table id='members'>
                            <tbody>
                                { this.props.relation == "Your Team" && <tr>{this.renderTableHeader()}</tr> }
                                { this.props.relation == "Target Team" && <tr>{this.renderTableHeader2()}</tr> }
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                }
                {this.props.team == null &&
                    <div>
                        <h1 id='title'>{this.props.relation}: N/A</h1>
                    </div>
                }
            </div>
        )
    }

    renderTableData() {
        return this.props.team.members.map((player, index) => {
            const { alias, name, dead } = player
            return (
                <>
                    {this.props.you == alias &&
                        <tr key={name} class="me" >
                            <td>{alias}</td>
                            <td>{name}</td>
                            <td>{dead && "Yes"}{!dead && "No"}</td>
                        </tr >}
                    {this.props.you != alias &&
                        <tr key={name} >
                            <td>{name}</td>
                            <td>{dead && "Yes"}{!dead && "No"}</td>
                        </tr >}
                </>
            )
        })
    }
}
