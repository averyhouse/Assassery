export const loadGame = () => {
    return (dispatch, getState) => {
        dispatch({ type: "GAME_LOADING" });

        return fetch(
            "/api/game/game/", {
            method: "GET",
            headers: {"Content-Type": "application/json"},
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
