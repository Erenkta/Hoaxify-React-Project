import React from 'react';
import logo from '../assets/hoaxify.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux'
import { logoutSuccess } from '../redux/authActions';
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

const TopBar = (props) => {
  const { t } = useTranslation()

  const reduxState /* {isLoggedIn,username} yazarak da olurdu*/ = useSelector((store) => {
    return {
      isLoggedIn: store.isLoggedIn,
      username: store.username,
      displayName: store.displayName,
      image: store.image,
    }
  })
  const { username, isLoggedIn, displayName, image } = reduxState
  const menuArea = useRef(null);

  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    document.addEventListener('click', menuClickTracker);
    return () => {
      document.removeEventListener('click', menuClickTracker);
    };
  }, [isLoggedIn]); // her seferinde effect'in çalışmamasını sadece loggedIn durumu değişince değişmesini sağladık

  const menuClickTracker = event => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  // const { /*username, isLoggedIn, onLogoutSuccess */} = props; //mapStateToProps sayesinde propslara çevrildi

  const dispatch = useDispatch();
  const onLogoutSuccess = () => {
    dispatch(logoutSuccess())
  }

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
    let dropDownClass = 'dropdown-menu p-0 shadow';
    if (menuVisible) {
      dropDownClass += ' show';
    }


    links = (
      <ul className="navbar-nav ml-auto " ref={menuArea}>{/* Buraya dedik ki menuArea diye tanımadığımız yer buraya işaret etsin*/}
        <li className='nav-item dropdown' >
          <div className='d-flex' style={{ cursor: 'pointer' }} onClick={() => { setMenuVisible(true) }}>
            <ProfileImageWithDefault image={image} width='32' height='32' className='rounded-circle m-auto' />
            <span className='nav-link dropdown-toggle'>
              {displayName}
            </span>
          </div>
          <div className={dropDownClass}>
            <Link className="dropdown-item d-flex p-2" to={`/user/${username}`} onClick={() => { setMenuVisible(false) }}>
              <i className='material-icons text-info m-2'>person</i>
              {t('My Profile')}
            </Link>
            <span className="dropdown-item d-flex p-2" onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
              <i className='material-icons text-danger m-2'>logout</i>
              {t('Logout')}
            </span>
          </div>
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



/*
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
}*/
export default /*connect(mapStateToProps, mapDispatchToProps)*/(TopBar); //Connect methodunun 2.parametresiyle beraber actionları da bir component haline getirebiliiriz


//Redux hooks'un bize iki tane sunduğu hook var biri state  (mapStateToProps'ta kullanıcaz) diğeri ise dispatch (mapDispatchToProps'ta kullanıcaz)