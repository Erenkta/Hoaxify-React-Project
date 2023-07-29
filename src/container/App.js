import React, { Component } from 'react';
import UserSignupPage from '../pages/UserSignupPage';
import LoginPage from '../pages/LoginPage';
import LanguageSelector from '../components/LanguageSelector';
import HomePage from '../pages/HomePage';
import UserPage from '../pages/UserPage';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import TopBar from '../components/TopBar';
class App extends Component {

  state = {
    isLoggedIn: false,
    username: undefined,
  }

  onLoginSuccess = (username) => {
    this.setState({
      username: username,
      isLoggedIn: true
    })
  }
  onLogoutSuccess = () => {
    this.setState({
      isLoggedIn: false,
      username: undefined,
    })
  }

  render() {
    const { isLoggedIn, username } = this.state //Burada pasladık
    return (
      <div>
        <Router>
          <TopBar username={username} isLoggedIn={isLoggedIn} onLogoutSuccess={this.onLogoutSuccess} />
          <Switch>
            <Route exact path="/" component={HomePage} />
            {!isLoggedIn && (< Route path="/login" component={(props) => { return <LoginPage {...props} onLoginSuccess={this.onLoginSuccess} /> }} />)}
            {!isLoggedIn && (<Route path="/signup" component={UserSignupPage} />)}
            <Route path="/user/:username" component={UserPage} />
            <Redirect to="/" />
          </Switch>
        </Router>
        <LanguageSelector />
      </div>
    );
  }
}

export default App;

/*
 <Route path="/login" component={(reactRouterProps) => { return <LoginPage {...reactRouterProps} /> }} />

 Burada amaç Bize Route'un verdiği property'leri Login page'e olduğu gibi vermek
 zaten bu default olarak da veriliyordu ama biz başka bir şeyler de pass'layacağımız için bunu vermemiz lazımdı

 onLoginSuccess={this.onLoginSuccess} bu da login success olunca yapılacak bir şey istiyordu biz de dedik ki bunu çalıştır



 Sorun şu ki biz giriş yapsak bile hala url kısmına Login yazarak login page'i açabiliyoruz
 bunu düzeltmek için  bir kaç işlem yapıcaz
          {!isLoggedIn && < Route path="/login" component={(props) => { return <LoginPage {...props} onLoginSuccess={this.onLoginSuccess} /> }} />}
Böyle bir conditional belirleyerek yapabiliriz
*/