import React, { useContext } from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux'
import { logoutSuccess } from '../redux/authActions';

const TopBar = (props) => {



  /*
  onClickLogout = () => {
    this.props.dispatch(logoutSuccess()) //burada action oluşturduk ve dispatch ettik. Bunun state'i etkilemesi için bir reducer'a düşmeli --> action -> reducer -> state
  }*/

  //console.log(this.props)


  const { t, username, isLoggedIn, onLogoutSuccess } = props; //mapStateToProps sayesinde propslara çevrildi

  let links = (
    <ul className="navbar-nav ml-auto">
      <li>
        <Link className="nav-link" to="/login">
          {t('Login')}
        </Link>
      </li>
      <li>
        <Link className="nav-link" to="/signup">
          {t('Sign Up')}
        </Link>
      </li>
    </ul>
  );
  if (isLoggedIn) {
    links = (
      <ul className="navbar-nav ml-auto">
        <li>
          <Link className="nav-link" to={`/user/${username}`}>
            {username}
          </Link>
        </li>
        <li className="nav-link" onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
          {t('Logout')}
        </li>
      </ul>
    );
  }

  return (
    <div className="shadow-sm bg-light mb-2">
      <nav className="navbar navbar-light container navbar-expand">
        <Link className="navbar-brand" to="/">
          <img src={logo} width="60" alt="Hoaxify Logo" />
          Hoaxify
        </Link>
        {links}
      </nav>
    </div>
  );

}


const TopBarWithTranslation = withTranslation()(TopBar)

const mapStateToProps = (store) => {
  return {
    // store diye hepsini alırız ya da ihtiyacımız olan kısımları alırız
    isLoggedIn: store.isLoggedIn, //ilk kısma istediğimiz ismi verebiliriz (keylere)
    username: store.username
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogoutSuccess: () => {
      return dispatch(logoutSuccess()) // Bu sayede ismi onLogoutSuccess olan ve bir action olan component oluşturduk
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TopBarWithTranslation); //Connect methodunun 2.parametresiyle beraber actionları da bir component haline getirebiliiriz
