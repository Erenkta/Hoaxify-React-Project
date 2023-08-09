import React from 'react';
import UserList from '../components/UserList';
import HoaxSubmit from '../components/HoaxSubmit';
import { useSelector } from 'react-redux';
import HoaxFeed from '../components/HoaxFeed';

const HomePage = () => {
  const { isLoggedIn } = useSelector((store) => {
    return {
      isLoggedIn: store.isLoggedIn
    }
  })
  return (
    <div className="container">
      <div className='row'>
        {isLoggedIn && <div className='col'> <HoaxSubmit /> <HoaxFeed /> </div>}
        {!isLoggedIn && <div className='col'> <HoaxFeed /></div>}
        <div className='col'>
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
