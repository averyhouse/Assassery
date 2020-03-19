export const login = (name, auth) => {
    return {
        type: 'LOG_IN',
        name,
        auth
    }
}

export const logout = () => {
    return {
        type: 'LOG_OUT'
    }
}