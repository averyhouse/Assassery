export const loadGame = () => {
    return (dispatch, getState) => {
        dispatch({ type: "GAME_LOADING" });

        return fetch(
            "/api/game/game/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => {
                        dispatch({ type: "GAME_LOADED", ...data });
                        return res.data;
                    }
                )
            } else if (res.status >= 500) {
                console.log("Server Error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
    }
}

export const loadDashboard = () => {
    return (dispatch, getState) => {
        dispatch({ type: "DASHBOARD_LOADING" });

        return fetch(
            "/api/game/dashboard/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => {
                        dispatch({ type: "DASHBOARD_LOADED", ...data });
                        return res.data;
                    }
                )
            } else if (res.status >= 500) {
                console.log("Server Error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
    }
}

export const loadTeamLeaderboard = () => {
    return (dispatch, getState) => {
        dispatch({ type: "TEAM_LEADERBOARD_LOADING" });

        return fetch(
            "/api/game/teamleaderboard/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then(res => {
            if (res.status === 200) {
                res.json().then(
                    data => {
                        dispatch({ type: "TEAM_LEADERBOARD_LOADED", ...data });
                        return res.data;
                    }
                )
            } else if (res.status >= 500) {
                console.log("Server Error!");
                throw res;
            } else {
                console.log("Error!");
                throw res;
            }
        })
    }
}
