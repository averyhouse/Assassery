// Important Things //
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect, useStore } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Redux
import assasseryFrontend from './reducers';
import { auth, game } from './actions';

// CSS Stylesheets //
import './assets/css/index.scss';

// Pages //
import Rules from './pages/Rules';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import Status from './pages/Status';
import NotFound from './pages/NotFound';
import FullKillFeed from './pages/FullKillFeed';
import FullLeaderboard from './pages/FullLeaderboard';

import DeathModal from './components/DeathModal';

// Images //
import AssasseryLogo from './assets/images/assassery_dark_logo.png';
import camera_icon from './assets/images/camera_icon.png';

let store = createStore(assasseryFrontend, applyMiddleware(thunk));

// These are sizes of screens that prompt changes in styling. 
// Make sure to update them concurrently with assets/css/vars.scss
let mediumWidth = 640;
let largeWidth = 768;

class RootContainerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            killer: null
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.confirmDeath = this.confirmDeath.bind(this);
        this.denyDeath = this.denyDeath.bind(this);
        this.amDead = this.amDead.bind(this);
        this.killViaQR = false;
    }

    amDead() {
        if (!this.props.auth.user) return false;
        let kill = this.props.game.killfeed.find((kill) => kill.victim_username == this.props.auth.user.username && !kill.confirmed);
        if (!kill) {
            return false;
        }
        if (!this.state.killer) {
            this.setState({ killer: kill.killer_username });
        }
        return true
    }

    confirmDeath(bool) {
        let data = this.props.game.killfeed.find((kill) => kill.victim_username == this.props.auth.user.username && !kill.confirmed);
        if (!data) {
            return false;
        }
        data['confirm'] = bool

        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Token ${this.props.auth.token}`
        };

        fetch(
            "/api/game/kill/", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data)
        })
        window.location.reload(false);
        return true;
    }

    denyDeath() {
        this.setState({
            showDeathModal: false
        });
    }

    componentDidMount() {
        this.props.loadUser();
        this.props.loadGame();
        this.props.loadDashboard();
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
        if (this.state.width > mediumWidth) {
            [...document.getElementsByClassName("open")].forEach(element => {
                element.classList.remove("open");
            });
        }
    }

    toggleMobileMenu() {
        if (document.getElementById("hamburger").className != "change") {
            document.getElementById("hamburger").className = "change";
        } else {
            document.getElementById("hamburger").className = "no-change"
        }

        let nav = document.getElementsByClassName("nav-list")[0];
        if (nav.classList.contains("open")) {
            nav.classList.remove("open");
        } else {
            nav.classList.add("open");
        }
        return false;
    }

    PrivateRoute = ({ component: ChildComponent, ...rest }) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else if (!this.props.auth.isAuthenticated) {
                return <Redirect to="/login" />;
            } else {
                return <ChildComponent {...props} />
            }
        }} />
    }

    render() {
        let { PrivateRoute } = this;
        let login;
        if (!this.props.auth.isAuthenticated) {
            login = <Link class="lighter" to={`/login`} onClick={this.toggleMobileMenu}>LOGIN</Link>
        } else {
            login = <Link class="lighter" to="#" onClick={() => { this.props.logout(); this.toggleMobileMenu(); }}>LOGOUT</Link>
        }
        return (
            <Router>
                <div class="navbar">
                    <ul class="nav-list">
                        <li class="menu"><Link class="ham-link" to="#" onClick={this.toggleMobileMenu}>
                            <div id="hamburger">
                                <div class="bar1"></div>
                                <div class="bar2"></div>
                                <div class="bar3"></div>
                            </div>
                        </Link></li>
                        <li class="logo">
                            <Link to={`/`}><img height="50" src={AssasseryLogo} alt={"Logo is missing!"} /></Link>
                        </li>
                        <li class="link">
                            {login}
                        </li>
                        <li class="link">
                            <Link to={`/rules`}>RULES</Link>
                        </li>
                        <li class="link"><Link class="lighter" to={`/leaderboard`} onClick={this.toggleMobileMenu}>FULL LEADERBOARD</Link></li>
                        <li class="link"><Link to={`/killfeed`} onClick={this.toggleMobileMenu}>FULL KILL FEED</Link></li>
                        {this.props.game.inProgress && this.props.auth.assassin &&
                            <li class="link"><Link class="lighter" to={`/status`} onClick={this.toggleMobileMenu}>TEAM STATUS</Link></li>
                        }
                        {this.props.game.inProgress && this.props.auth.assassin && !this.props.auth.assassin.dead && this.killViaQR &&
                            <li class="link"><Link to={`/scan`} onClick={this.toggleMobileMenu}>QR SCANNER</Link></li>
                        }
                        {this.props.game.inProgress && this.props.auth.assassin && !this.props.auth.assassin.dead && this.killViaQR &&
                            <li class="link"><Link class="lighter" to={`/qr`} onClick={this.toggleMobileMenu}>YOUR QR CODE</Link></li>
                        }
                    </ul>
                </div>

                <div class="main">
                    <main>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/rules" component={Rules} />
                            <Route path="/leaderboard" component={FullLeaderboard} />
                            <Route path="/killfeed" component={FullKillFeed} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <PrivateRoute path="/qr" component={QRGenerator} />
                            <PrivateRoute path="/scan" component={QRScanner} />
                            <PrivateRoute path="/status" component={Status} />
                            <Route component={NotFound} />
                        </Switch>
                        {this.amDead() && <DeathModal confirm={() => this.confirmDeath(true)} deny={() => this.confirmDeath(false)} killer={this.state.killer}></DeathModal>}
                    </main>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        game: state.game
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        logout: () => {
            return dispatch(auth.logout());
        },
        loadGame: () => {
            return dispatch(game.loadGame());
        },
        loadDashboard: () => {
            return dispatch(game.loadDashboard());
        }
    }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);


ReactDOM.render(
    <Provider store={store}>
        <RootContainer />
    </Provider>,
    document.getElementById('app')
);
