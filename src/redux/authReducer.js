
import * as ACTIONS from './Constants'
const defaultState = { //Login olmamış bir kullanıcı datası var
    isLoggedIn: false,
    username: undefined,
    displayName: undefined,
    image: undefined,
    password: undefined
};

const authReducer = (state = { ...defaultState }, action) => {
    if (action.type === ACTIONS.LOGOUT_SUCCESS) {
        return defaultState
    }
    else if (action.type === ACTIONS.LOGIN_SUCCESS) {
        return {
            ...action.payload,
            isLoggedIn: true
        }
    }
    else if (action.type === ACTIONS.UPDATE_SUCCESS) {
        return {
            ...state,
            /* bunun yerine
            displayName: action.payload.displayName,
            image: action.payload.displayName*/
            ...action.payload //aynısı
        }
    }
    return state
}
export default authReducer;