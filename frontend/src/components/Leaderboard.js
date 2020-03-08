import React, { Component } from 'react';
import './Leaderboard.css';

export default class Leaderboard extends Component {
    renderTableHeader() {
      let header = Object.keys(this.state.players[0])
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

    constructor(props) {
      super(props)
      this.state = {
         players: [
            { alias: 'big chungus', kills: 3, deaths: 0 },
            { alias: 'big shaq', kills: 2, deaths: 2 }
         ]
      }
   }

   renderTableData() {
      return this.state.players.map((player, index) => {
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