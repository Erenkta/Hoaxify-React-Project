import React, { Component } from 'react';
import Input from '../components/Input';
import { withTranslation } from 'react-i18next';
import { login } from '../api/apiCalls';
import axios from 'axios';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { Button } from 'bootstrap';


class LoginPage extends Component {
  state = {
    username: null,
    password: null,
    error: null,
    pendingApiCall: false

  };

  componentDidMount() {//Component ekrana ilk koyulduğ an
    console.log("Login Page added to screen");
    axios.interceptors.request.use((request) => {
      this.setState({
        pendingApiCall: true //request atıldığı zaman bunu true'ya çektik
      })
      return request;
    })
    axios.interceptors.response.use((response) => {
      this.setState({
        pendingApiCall: false //Response döndüğü için bekleyen bir apiCall yok ondan bunu false yap
      })
      return response
    }, (error) => { //Burası da hataya düşen response'lar için
      this.setState({
        pendingApiCall: false
      })
      throw error; //Eğer hata varsa error'u fırlattık
    })
  }


  onChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      error: null //bir şeyler yazınca error null olduğu için göstermicek
    });
  };

  onClickLogin = async event => {
    event.preventDefault();
    const { username, password } = this.state;
    const creds = {
      username,
      password
    };
    this.setState({ //Login'e tekrar basınca anlık kaybolsun hep orda durmasın diye
      error: null
    })

    try {
      const response = await login(creds)
    } catch (exception) {
      this.setState({
        error: exception.response.data.message //Axios'un bize gönderdeki Json body içindeki mesaja eriştik
      })
    }
  };

  render() {
    const { t } = this.props;
    const { error, username, password, pendingApiCall } = this.state


    const buttonEnabled = username && password;
    return (
      <div className="container">
        <form>
          <h1 className="text-center">{t('Login')}</h1>
          <Input label={t('Username')} name="username" onChange={this.onChange} />
          <Input label={t('Password')} name="password" type="password" onChange={this.onChange} />
          {error && <div className="alert alert-danger" role='alert' >{error}</div>}
          <div className="text-center">
            <ButtonWithProgress
              onClick={this.onClickLogin}
              disabled={!buttonEnabled || pendingApiCall}
              call={pendingApiCall}
              text={t('Login')} />
          </div>
        </form>
      </div>
    );
  }
}

export default withTranslation()(LoginPage);




