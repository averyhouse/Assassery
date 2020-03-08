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
            <ul>

                <li><Link to={`/login`}>LOGIN</Link></li>
                <li><Link to={`/scan`}>QR SCANNER</Link></li>
                <li><Link to={`/qr`}>YOUR QR CODE</Link></li>
                <logo>
                    <Link to={`/`}>
                        <img width="50" height="50" src={AveryLogo} alt="Avery Logo :("/>
                        ss
                        <img width="50" height="50" src={AveryLogo} alt="Avery Logo :("/>
                        ssery
                    </Link>
                </logo>
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
