import * as ACTIONS from './Constants'
import { login, signup } from '../api/apiCalls'


export const logoutSuccess = () => {
    return {
        type: ACTIONS.LOGOUT_SUCCESS
    }
}

export const loginSuccess = (authState) => {
    return {
        type: ACTIONS.LOGIN_SUCCESS,
        payload: authState
    }
}

export const updateSuccess = ({ displayName, image }) => {
    return {
        type: ACTIONS.UPDATE_SUCCESS,
        payload: {
            displayName,
            image
        }
    }
}






export const loginHandler = (credentials) => { //Login page içinde yaptıklarımızı bir bakıma burada yapıyoruz
    return async (dispatch) => { //Dispatch'i almak için oraya yazdık ve returnden kastı aslında bu fonksiyonun ne yapacağı 
        const response = await login(credentials)
        const authState = {
            ...response.data.user,
            password: credentials.password,
            token: response.data.token
        }
        dispatch(loginSuccess(authState))
        return response //Belki response objesini kullanır diye de geri döndük
    }
}  //Burasi yukarıdaki diğer 2 fonksiyon gibi bir Js objesi dönmek yerine bir async fonksiyon dönüyor. Bunu işlemek için de bir middleware'a ihtiyaç var. bunu da configureStore içinde kuracağız


export const signupHandler = (user) => {
    return async (dispatch) => {
        const response = await signup(user);
        await dispatch(loginHandler(user))
        return response
    }
}
