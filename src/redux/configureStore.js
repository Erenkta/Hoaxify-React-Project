import { createStore, applyMiddleware, compose } from "redux";
import authReducer from './authReducer'
import SecureLS from "secure-ls";
import thunk from 'redux-thunk'
import { setAuthorizationHeader } from "../api/apiCalls";

const secureLs = new SecureLS();

const getStateFromLocalStorage = () => {
    const hoaxAuth = secureLs.get('hoax-auth')   //localStorage.getItem('hoax-auth')
    let stateInLocalStorage = { //baslangıcta login değiliz
        isLoggedIn: false,
        username: undefined,
        displayName: undefined,
        image: undefined,
        password: undefined
    }
    if (hoaxAuth != null) { //eğer storage'da item varsa demek ki kayıt oluşturulmuş o zaman bunu parse edelim state'i tutalım
        /*
        try {  //Bunu yaparak LocalStorage değeri el ile değiştirilse bile ezip yine hatayı kaldırmaya yaradı
            stateInLocalStorage = JSON.parse(hoaxAuth) //String to JSON
        } catch (error) {

        }*/ //Dönüşüm olmadığı için try catch'e de gerek yok
        stateInLocalStorage = hoaxAuth  //Ya da return hoaxAuth hangsini istersen
    }
    return stateInLocalStorage
}


const updateStateInLocalStorage = (newState) => {

    secureLs.set('hoax-auth', newState) //secureLs de dönüştürmek yok       //localStorage.setItem('hoax-auth', JSON.stringify(newState));
    //getState bize JSON objesi dönüyor fakat bize bir string lazım. JSON.stringify ile dönüştürebiliriz
}



const configureStore = () => {
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose //Middleware kullanırken Redux devtools kullanmak için
    const store = createStore(authReducer, getStateFromLocalStorage(), composeEnhancers(applyMiddleware(thunk))) //3. parametre middleware için
    //state objesi vermek zorundayız //State'i kaldırdık çünkü dynamic yapacağız //State'i tekrar koyduk ama dinamik oldu eğer storage'da bir nesne tutulmuyorsa ve tutuluyorsa diye farklı seçenekler var

    const initialState = getStateFromLocalStorage()
    setAuthorizationHeader(initialState)

    store.subscribe(() => {
        updateStateInLocalStorage(store.getState())
        setAuthorizationHeader(store.getState())
    })   //store'umuzun içindeki değişimlerden haberdar olmamızı sağlar

    return store
}


export default configureStore

//Redux kullanıyorsak store sadece 1 tane olabilir
//Local Storage yerine secure-ls'in storage'ını kullanarak daha güvenli hale getirelim

//Secure ls 'den sonra hoax-auth encoded oldu