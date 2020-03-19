import { connect } from 'react-redux';
import { user } from './actions';

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        isAuthenticated: state.auth.isAuthenticated,
        isLoading: state.auth.isLoading,
        user: state.auth.user,
        errors: state.auth.errors
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default function connected(WrappedComponent) {
    return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}