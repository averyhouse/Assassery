// Important Things //
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { connect } from 'react-redux';

// Redux
import assasseryFrontend from './reducers';
import { auth } from './actions';

// CSS Stylesheets //
import './assets/css/index.scss';

// Pages //
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QRGenerator from './pages/QRGenerator';
import QRScanner from './pages/QRScanner';
import NotFound from './pages/NotFound';

// Images //
import AssasseryLogo from './assets/images/assassery_dark_logo.png';

let store = createStore(assasseryFrontend, applyMiddleware(thunk));

// These are sizes of screens that prompt changes in styling. 
// Make sure to update them concurrently with assets/css/vars.scss
let mediumWidth = 641;
let largeWidth = 769;

class RootContainerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: window.innerWidth, height: window.innerHeight
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.props.loadUser();
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
        console.log(this.state);
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
            login = <Link to={`/login`}>LOGIN</Link>
        } else {
            login = <Link to="#" onClick={this.props.logout}>LOGOUT</Link>
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
                        {this.props.auth.isAuthenticated &&
                            <li class="link"><Link to={`/scan`}>QR SCANNER</Link></li>
                        }
                        {this.props.auth.isAuthenticated &&
                            <li class="link"><Link to={`/qr`}>YOUR QR CODE</Link></li>
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
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        },
        logout: () => {
            return dispatch(auth.logout());
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
