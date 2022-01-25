import React, { Component } from 'react';
import '../assets/css/Team.scss';

export default class Team extends Component {

    renderTableHeader() {
        let header = Object.keys({ alias: '', name: '', dead: '' })
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                {this.props.team != null &&
                    <div>
                        <h1 id='title'>{this.props.relation}: {this.props.team.name}</h1>
                        <table id='members'>
                            <tbody>
                                <tr>{this.renderTableHeader()}</tr>
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
        console.log(this.props)
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
                            <td>{alias}</td>
                            <td>{name}</td>
                            <td>{dead && "Yes"}{!dead && "No"}</td>
                        </tr >}
                </>
            )
        })
    }
}
