import { connect } from 'react-redux';
import { user } from './actions';

const mapStateToProps = state => {
    return {
        user: state.user.name,
        auth: state.user.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login: (name, auth) => {
            dispatch(user.login(name, auth));
        },
        logout: () => {
            dispatch(user.logout());
        }
    }
}

export default function connected(WrappedComponent) {
    return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}