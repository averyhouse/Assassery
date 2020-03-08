// Important Things //
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';

// CSS Stylesheets //
import './index.css';
import './assets/css/nav.css';

// Pages //
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';

// Images //
import AveryLogo from './assets/images/avery.svg';

ReactDOM.render(
    <Router>
        <div class="navbar">
            <Link to={`/`}>
                <logo>
                    <img width="75" height="75" src={AveryLogo} alt="Avery Logo :("/>
                    <h1>ss</h1>
                    <img width="75" height="75" src={AveryLogo} alt="Avery Logo :("/>
                    <h1>ssery</h1>
                </logo>
            </Link>
            <ul>
                <li><Link to={`/qr`}>Your QR Code</Link></li>
                <li><Link to={`/scan`}>QR Scanner</Link></li>
                <li><Link to={`/login`}>Login</Link></li>
            </ul>
        </div>

        <div class="main">
            <main>
                <Route exact path="/" component={Dashboard}/>
                <Route path="/login" component={Login}/>
                <Route path="/qr" component={QRGenerator}/>
                <Route path="/scan" component={QRScanner}/>
            </main>
        </div>
    </Router>,
    document.getElementById('root')
);
