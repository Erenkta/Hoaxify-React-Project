import React from 'react';
import ProfileCard from '../components/ProfileCard';
import { useState } from 'react';
import { getUserByUsername } from '../api/apiCalls';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from '../components/Spinner';

const UserPage = props => {

  const [user, setUser] = useState({});
  const { username } = props.match.params
  const [notFound, setNotFound] = useState(false)
  const pendingApiCall = useApiProgress('get', '/api/1.0/users/' + username)

  useEffect(() => {
    setNotFound(false)
  }, [user])

  useEffect(() => {
    const loadUser = async () => { //Bunu böyle yapınca parametre değişince kendini yenilemesini sağladık
      try {
        const response = await getUserByUsername(username)
        setUser(response.data) //JsonBody'i user'a verdik

      } catch (error) { setNotFound(true) }
    }
    loadUser()
  }, [username]);

  const { t } = useTranslation()

  if (pendingApiCall) {
    return (
      <Spinner />
    )
  }

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


  return (
    <div className="container">
      <ProfileCard user={user} />
    </div>
  );

};

export default UserPage;
