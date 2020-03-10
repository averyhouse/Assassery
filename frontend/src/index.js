// Important Things //
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

// CSS Stylesheets //
import './index.css';
import './assets/css/nav.css';

// Pages //
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
// import NotFound from './pages/NotFound';
import LoginForm from './components/LoginForm';

// Images //
import AssasseryLogo from './assets/images/assassery_dark_logo.png';

ReactDOM.render(
    <Router>
        <div class="navbar">
            <ul>
                <li><Link to={`/login`}>LOGIN</Link></li>
                <li><Link to={`/scan`}>QR SCANNER</Link></li>
                <li><Link to={`/qr`}>YOUR QR CODE</Link></li>
                <div class = "logo">
                    <Link to={`/`}><img height="50" src={AssasseryLogo} alt={"Logo is missing!"}/></Link>
                </div>
            </ul>
        </div>

        <div class="main">
            <main>
                <Switch>
                <Route exact path="/" component={Dashboard}/>
                <Route path="/login" component={Login}/>
                <Route path="/qr" component={QRGenerator}/>
                <Route path="/scan" component={QRScanner}/>
                {/*<Route component={NotFound} />*/}
                </Switch>
                <LoginForm />
            </main>
        </div>
    </Router>,
    document.getElementById('root')
);
