import React, { useState } from 'react';
import Input from '../components/Input';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { withApiProgress } from '../shared/ApiProgress';
import { useDispatch } from 'react-redux'
import { signupHandler } from '../redux/authActions';
import { useTranslation } from 'react-i18next';

const UserSignupPage = (props) => {
  const [form, setForm] = useState({
    username: null,
    displayName: null,
    password: null,
    passwordRepeat: null,
  })
  const [errors, setErrors] = useState({}) //Başlangıç değeri verdik ve null dedik
  const dispatch = useDispatch()
  const { t } = useTranslation()


  const onChange = event => {

    const { name, value } = event.target;

    //const errorsCopy = { ...errors }; //varolan errors objesini kopyaladık
    //errorsCopy[name] = undefined; //Bunun yerine alttakini de yapabiliriz
    //setErrors(errorsCopy)
    setErrors((previousErrors) => {
      return {
        ...previousErrors,
        [name]: undefined
      }
    })


    //İsmini direk errors olarak değil errorsCopy yaptık çünkü redux karşılaştırınca aynı obje sanıp değiştirmiyor
    // buradaki amaç fieldların değişimini gözlemekti
    //Form'un kopyasını oluşturduk ve girilen değerleri önce formCopy'e kaydettik. Daha sonrasında bu formCopy'i form state'ine atadık

    /*Alttaki yöntem daha profesyonel ondan bu comment out ama çalışıyor
    const formCopy = { ...form }
    formCopy[name] = value
    setForm(formCopy)*/

    //Burada önceki formu aldık ve ...previousForm ile fieldları otomatik yerleştirdik tek tek username : form.username yapmadan. Daha sonra dedik ki [name] = value yani
    // name kısmına karşılık gelen değeri o an ki value ile değiştir Daha anlamsız gelebilir ama daha prof.
    setForm((previousForm) => {
      return {
        ...previousForm, //Spread operator
        [name]: value
      }
    })



  };

  const onClickSignup = async event => {
    event.preventDefault();

    const { username, displayName, password } = form;
    const { history } = props
    const { push } = history

    const body = {
      username,
      displayName,
      password
    };

    try {
      await dispatch(signupHandler(body))
      push('/')
    } catch (error) {
      if (error.response.data.validationErrors) {
        setErrors(error.response.data.validationErrors)
      }
    }
  };

  const { username: usernameError, displayName: displayNameError, password: passwordError } = errors; //Dedik ki bunları böyle bir değişkenden alıcaz
  const { pendingApiCall } = props;
  let passwordRepeatError //Validation işlemini kısalttık
  if (form.password !== form.passwordRepeat) {
    passwordRepeatError = t('Password mismatch')
  }
  return (
    <div className="container">
      <form>
        <h1 className="text-center">{t('Sign Up')}</h1>
        <Input name="username" label={t('Username')} error={usernameError} onChange={onChange} />
        <Input name="displayName" label={t('Display Name')} error={displayNameError} onChange={onChange} />
        <Input name="password" label={t('Password')} error={passwordError} onChange={onChange} type="password" />
        <Input name="passwordRepeat" label={t('Password Repeat')} error={passwordRepeatError} onChange={onChange} type="password" />
        <div className="text-center">
          <ButtonWithProgress
            onClick={onClickSignup}
            disabled={pendingApiCall || passwordRepeatError !== undefined}
            pendingApiCall={pendingApiCall}
            text={t('Sign Up')}
          />
        </div>
      </form>
    </div>
  );

}

const UserSignupPageWithApiProgressForSignupRequest = withApiProgress(UserSignupPage, '/api/1.0/users');
const UserSignupPageWithApiProgressForAuthRequest = withApiProgress(UserSignupPageWithApiProgressForSignupRequest, '/api/1.0/auth');


export default UserSignupPageWithApiProgressForAuthRequest;