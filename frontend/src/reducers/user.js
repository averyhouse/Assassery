const initialState = {
    name: "Elia",
    auth: ""
};

export default function user(state=initialState, action) {
    switch (action.type) {

      case 'LOG_IN':
         return {
           name: action.name,
           auth: action.auth
         };

      case 'LOG_OUT':
        return initialState;

      default:
        return state;
    }
  }