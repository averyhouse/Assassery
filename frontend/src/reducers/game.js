const initialState = {
    isLoadingGame: true,
    isLoadingDashboard: true,
    inProgress: false,
    winner: 'N/A',
    errors: {},
    killfeed: [],
    leaderboard: []
};


export default function game(state = initialState, action) {

    switch (action.type) {

        case 'GAME_LOADING':
            return { ...state, isLoadingGame: true };

        case 'GAME_LOADED':
            return { ...state, isLoadingGame: false, inProgress: action.inprogress, winner: action.winner };

        case 'DASHBOARD_LOADING':
            return { ...state, isLoadingDashboard: true };

        case 'DASHBOARD_LOADED':
            return { ...state, isLoadingDashboard: false, killfeed: action.killfeed, leaderboard: action.leaderboard };

        default:
            return state;

    }
}
