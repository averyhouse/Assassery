import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import './index.css';
import './assets/css/nav.css'

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';

ReactDOM.render(
  <Router>
      <div class="navbar">
          <aside>
            <ul>
              <li><Link to={`/login`}>Login</Link></li>
              <li><Link to={`/`}>Dashboard</Link></li>
              <li><Link to={`/qr`}>Your QR</Link></li>
              <li><Link to={`/scan`}>Scan a code</Link></li>
            </ul>
          </aside>

          <main>
            <Route exact path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/qr" component={QRGenerator} />
            <Route path="/scan" component={QRScanner} />
          </main>
      </div>
  </Router>,
  document.getElementById('root')
);
