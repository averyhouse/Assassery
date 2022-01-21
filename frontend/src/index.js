// Important Things //
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Redux
import assasseryFrontend from './reducers';
import { auth, game } from './actions';

// CSS Stylesheets //
import './assets/css/index.scss';

// Pages //
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import Status from './pages/Status';
import NotFound from './pages/NotFound';

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
            width: window.innerWidth, height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.killViaQR = false;
    }

    componentDidMount() {
        this.props.loadUser();
        this.props.loadGame();
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
        console.log(this.props.auth);
        if (!this.props.auth.isAuthenticated) {
            login = <Link to={`/login`} onClick={this.toggleMobileMenu}>LOGIN</Link>
        } else {
            login = <Link to="#" onClick={() => { this.props.logout(); this.toggleMobileMenu(); }}>LOGOUT</Link>
        }
        return (
            <Router>
                <div class="navbar">
                    <ul class="nav-list">
                        <li class="menu"><Link to="#" onClick={this.toggleMobileMenu}>ham</Link></li>
                        <li class="logo">
                            <Link to={`/`}><img height="50" src={AssasseryLogo} alt={"Logo is missing!"} /></Link>
                        </li>
                        <li class="link">
                            {login}
                        </li>
                        {this.props.game.inProgress && this.props.auth.assassin &&
                            <li class="link"><Link to={`/status`} onClick={this.toggleMobileMenu}>TEAM STATUS</Link></li>
                        }
                        {this.props.game.inProgress && this.props.auth.assassin && !this.props.auth.assassin.dead && this.killViaQR &&
                            <li class="link"><Link to={`/scan`} onClick={this.toggleMobileMenu}>QR SCANNER</Link></li>
                        }
                        {this.props.game.inProgress && this.props.auth.assassin && !this.props.auth.assassin.dead && this.killViaQR &&
                            <li class="link"><Link to={`/qr`} onClick={this.toggleMobileMenu}>YOUR QR CODE</Link></li>
                        }
                    </ul>
                </div>

                <div class="main">
                    <main>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <PrivateRoute path="/qr" component={QRGenerator} />
                            <PrivateRoute path="/scan" component={QRScanner} />
                            <PrivateRoute path="/status" component={Status} />
                            <Route component={NotFound} />
                        </Switch>
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
