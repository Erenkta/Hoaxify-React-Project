import React, { Component } from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';


class TopBar extends Component {

  render() {
    const { t, isLoggedIn, username, onLogoutSuccess } = this.props; //Props'tan aldık state'den almak yerine

    let links = ( //Let değişkene sonradan atama yapabilmemizi sağlıyor. Const ise sabit 
      <ul className="navbar-nav ms-auto">
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
    )
    if (isLoggedIn) {
      links = (
        <ul className="navbar-nav ms-auto">
          <li>
            <Link className="nav-link" to={`/user/${username}`}>
              {username}
            </Link>
          </li>
          <li className="nav-link" onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
            {t('Logout')}
          </li>
        </ul>
      )
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
}

export default withTranslation()(TopBar);


/*
Lifting state up bulunduğunuz componenttaki stateleri yukarıdakilere taşıyın diyor
Bizim top barımız da login page'imiz de app içinde bulunuyor. App bunlardan hiyerarşik olarak daha üstte
Bu durumda bizim yapmamız gereken şey State'imizi App'e taşımak bu sayede lifting state up yapabiliriz
*/