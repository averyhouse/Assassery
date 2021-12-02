const initialState = {
    isLoading: true,
    inProgress: false,
    winner: 'N/A',
    errors: {},
};


export default function game(state = initialState, action) {

    switch (action.type) {

        case 'GAME_LOADING':
            return { ...state, isLoading: true };

        case 'GAME_LOADED':
            return { ...state, isLoading: false, inProgress: action.inprogress, winner: action.winner };

        default:
            return state;
            
    }
}
