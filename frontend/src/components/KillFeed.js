import React, { Component } from 'react';
import './KillFeed.css';

export default class KillFeed extends Component {
    renderTableHeader() {
      let header = Object.keys(this.state.kills[0])
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

    constructor(props) {
      super(props)
      this.state = {
         kills: [
            { timestamp: '08:20:19', message: 'I killed myself by drowning in fire' },
            { timestamp: '04:20:39', message: 'Coronavirus killed everyone by causing respiratory failure' }
         ]
      }
   }

   renderTableData() {
      return this.state.kills.map((kill, index) => {
         const { timestamp, message } = kill
         return (
            <tr key={name}>
               <td>{timestamp}</td>
               <td>{message}</td>
            </tr>
         )
      })
   }
}