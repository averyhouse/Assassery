export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({ type: "USER_LOADING" });

        const token = getState().auth.token;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("/api/auth/user/", { headers, })
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return { status: res.status, data };
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({ type: 'USER_LOADED', user: res.data });
                    return res.data;
                } else if (res.status >= 400 && res.status < 500) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                    throw res.data;
                }
            })
    }
}

export const login = (email, password) => {
    return (dispatch, getState) => {
        return fetch(
            "/api/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        }).then(res => {
            if (res.status < 500) {
                return res.json().then(data => {
                    return { status: res.status, data };
                })
            } else {
                console.log("Server error!");
                throw res;
            }
        }).then(res => {
            if (res.status === 200) {
                dispatch({ type: 'LOGIN_SUCCESSFUL', data: res.data });
                return res.data;
            } else if (res.status === 403 || res.status === 401) {
                dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
                throw res.data;
            } else {
                dispatch({ type: 'LOGIN_FAILED', data: res.data });
                throw res.data;
            }
        })
    }
}

export const register = (name, email, password, username, photo) => {
    return (dispatch, getState) => {
        var data = new FormData();
        data.append("name", name);
        data.append("email", email);
        data.append("password", password);
        data.append("username", username);
        data.append("photo", photo);
        console.log(data.getAll("photo"))
        return fetch("/api/auth/register/", {
            method: "POST",
            headers: {
            },
            body: data
        }).then(res => {
            if (res.status < 500) {
                return res.json().then(data => {
                    return { status: res.status, data };
                })
            } else {
                console.log("Server error!");
                throw res;
            }
        }).then(res => {
            if (res.status === 200) {
                dispatch({ type: 'REGISTRATION_SUCCESSFUL', data: res.data });
                return res.data;
            } else if (res.status === 403 || res.status === 401) {
                dispatch({ type: 'AUTHENTICATION_ERROR', data: res.data });
                throw res.data;
            } else {
                dispatch({ type: 'REGISTRATION_FAILED', data: res.data });
                throw res.data;
            }
        })
    }
}

export const logout = () => {
    return (dispatch, getState) => {
        return fetch("/api/auth/logout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${getState().auth.token}`
            },
            body: ""
        }).then(res => {
            if (res.status === 204) {
                return { status: res.status, data: {} };
            } else if (res.status < 500) {
                return res.json().then(data => {
                    return { status: res.status, data };
                })
            } else {
                console.log("Server Error!");
                throw res;
            }
        }).then(res => {
            if (res.status === 204) {
                dispatch({ type: 'LOGOUT_SUCCESSFUL' });
                return res.data;
            } else if (res.status === 403 || res.status === 401) {
                dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                throw res.data;
            }
        })
    }
}
