import React, { useEffect, useState } from 'react'
import Input from '../components/Input';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { useApiProgress } from '../shared/ApiProgress';

import { useDispatch } from 'react-redux'
import { loginHandler } from '../redux/authActions';

const LoginPage = (props) => {

  const [username, setUsername] = useState(); //İki parametre istiyor biri değişken diğeri de onu değiştirecek olan
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const dispatch = useDispatch() //Bunları en genelde tanımlamaliyiz
  const { t } = useTranslation() //props yerine burdan aldık
  //State'leri sırasına göre alıyor page'deki sıraya göre dikkat et

  //useEffect sayesinde username ve password fieldları değiştiği anda error varsa ortadan kaldırıcaz
  useEffect(() => {
    setError(undefined)
  }, [username, password]) //iki parametre alıyor birincisi çağrılacak fonksiyon. İkincisi de bu fonksiyonun çağrılmasını tetikleyen parametreler
  //Diyoruz ki username ve passwordde bir değişiklik olursa error'u undefined set et


  const onClickLogin = async event => {
    event.preventDefault();
    const creds = {
      username,
      password
    };


    const { history, /*dispatch*/ } = props //artık dispatch'i propstan değil de

    const { push } = history;



    setError(undefined)
    try {

      //Auth Action içindeki fonksiyonu çağırmak
      await dispatch(loginHandler(creds))

      push('/');
    } catch (apiError) {
      setError(apiError.response.data.message)
    }
  };


  //const {/* t ,*/ /*pendingApiCall */} = props;
  const pendingApiCall = useApiProgress('/api/1.0/auth') //Burada custom hook ile aldık hiç high order component ile uğraşmadan


  const buttonEnabled = username && password;


  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t('Login')}</h1>
        <Input label={t('Username')} onChange={event => setUsername(event.target.value)} />
        <Input label={t('Password')} type="password" onChange={event => setPassword(event.target.value)} />
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="text-center">
          <ButtonWithProgress
            onClick={onClickLogin}
            disabled={!buttonEnabled || pendingApiCall}
            pendingApiCall={pendingApiCall}
            text={t('Login')}
          />
        </div>
      </form>
    </div>
  );
}
//const LoginPageWithTranslation = withTranslation()(LoginPage); translation'ı hooks ile yapacağız ondan comment out
//const LoginPageWithApiProgress = withApiProgress(LoginPage/*LoginPageWithTranslation*/, '/api/1.0/auth') artık Custom hooks ile yapıcaz

/*
const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSuccess: (authSate) => {
      return dispatch(loginSuccess(authSate))
    }
  }
}  Burada bunu kaldırdık çünkü login işlemini ve daha sonrasında login'in redux'taki state'i güncelleme işlemini redux içinde yapacağız
*/

//export default (/*null, mapDispatchToProps*/)(LoginPageWithApiProgress); burda da comment out ettik çünkü dispatch'i useDispatch ile alabiliriz
export default LoginPage




// (1)
/*
const response = await login(creds);
const authState = {
  ...response.data,
  password
};
dispatch(loginSuccess(authState))
*/ //Burayı authAction içine yolladık

      //onLoginSuccess(authState);
/*
const action = {
  type: 'login-success',
  payload: authState
}
this.props.dispatch(action),
*/ // (1)