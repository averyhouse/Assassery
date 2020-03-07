// Important Things //
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'

// CSS Stylesheets //
import './index.css';
import './assets/css/nav.css'

// Pages //
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';

// Images //
import AveryLogo from './assets/images/avery.svg'

ReactDOM.render(
    <Router>
        <div>
            <div class="navbar">
                <aside>
                    <ul>
                        <li>
                            <img width="50" height="50" src={AveryLogo} alt="Avery Logo :("/>
                            <h1>ss</h1>
                            <img width="50" height="50" src={AveryLogo} alt="Avery Logo :("/>
                            <h1>ssery</h1>
                        </li>
                        <li><Link to={`/login`}>Login</Link></li>
                        <li><Link to={`/`}>Dashboard</Link></li>
                        <li><Link to={`/qr`}>Your QR</Link></li>
                        <li><Link to={`/scan`}>QR Scan</Link></li>
                    </ul>
                </aside>

                <main>
                    <Route exact path="/" component={Dashboard}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/qr" component={QRGenerator}/>
                    <Route path="/scan" component={QRScanner}/>
                </main>
            </div>
        </div>
    </Router>,
    document.getElementById('root')
);
