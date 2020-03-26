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
// import NotFound from './pages/NotFound';

// Images //
import AssasseryLogo from './assets/images/assassery_dark_logo.png';

let store = createStore(assasseryFrontend, applyMiddleware(thunk));

class RootContainerComponent extends Component {

    componentDidMount() {
        this.props.loadUser();
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
            login = <Link onClick={this.props.logout}>LOGOUT</Link>
        }
        return (
            <Router>
                <div class="navbar">
                    <ul>
                        <li class="menu"><Link>ham</Link></li>
                        <li class="link">
                            {login}
                        </li>
                        <li class="link"><Link to={`/scan`}>QR SCANNER</Link></li>
                        <li class="link"><Link to={`/qr`}>YOUR QR CODE</Link></li>
                        <div class="logo">
                            <Link to={`/`}><img height="50" src={AssasseryLogo} alt={"Logo is missing!"} /></Link>
                        </div>
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
                            {/*<Route component={NotFound} />*/}
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
