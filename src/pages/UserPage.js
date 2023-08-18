import React from 'react';
import ProfileCard from '../components/ProfileCard';
import { useState } from 'react';
import { getUser } from '../api/apiCalls';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from '../components/Spinner';
import HoaxFeed from '../components/HoaxFeed';
import Modal from '../components/Modal';

const UserPage = props => {

  const [user, setUser] = useState({});
  const { username } = useParams()
  const [notFound, setNotFound] = useState(false)
  const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + username, true) //tam olaarak bu adrese api isteği yolla herhangi bir ekstra parametre yok işte ne page vaar ne de başka bir ek ondan true dedik
  //bu sayede users/.../... gibi başka bir yerden atılan api ile çakışmayacak mesela users/user1/hoaxes gibi 
  const { t } = useTranslation()
  useEffect(() => {
    setNotFound(false)
  }, [user])

  useEffect(() => {
    const loadUser = async () => { //Bunu böyle yapınca parametre değişince kendini yenilemesini sağladık
      try {
        const response = await getUser(username)
        setUser(response.data) //JsonBody'i user'a verdik

      } catch (error) { setNotFound(true) }
    }
    loadUser()
  }, [username]);


  if (notFound) {
    return (
      <div className='container'>
        <div className="alert alert-danger text-center">
          <div>
            <i className="material-icons" style={{ fontSize: '48px' }}>error</i>
          </div>
          {t('User Not Found')}
        </div>
      </div>
    )
  }

  if (pendingApiCall || user.username !== username) {
    return (
      <Spinner />
    )
  }



  return (
    <>
      <div className="container">
        <div className='row'>
          <div className='col'>
            <ProfileCard user={user} />
          </div>
          <div className='col'>
            <HoaxFeed />
          </div>
        </div>
      </div>
    </>
  );

};

export default UserPage;
