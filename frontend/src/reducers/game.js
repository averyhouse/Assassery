const initialState = {
    isLoadingGame: true,
    isLoadingDashboard: true,
    isLoadingTeamLeaderboard: true,
    inProgress: false,
    winner: 'N/A',
    errors: {},
    killfeed: [],
    leaderboard: [],
    teamLeaderboard: []
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

        case 'TEAM_LEADERBOARD_LOADING':
            return { ...state, isLoadingTeamLeaderboard: true };

        case 'TEAM_LEADERBOARD_LOADED':
            return { ...state, isLoadingTeamLeaderboard: false, teamLeaderboard: action.teams }

        default:
            return state;

    }
}
