import React from 'react';
import { useParams } from 'react-router-dom';
//import { Authentication } from '../shared/AuthenticationContext';
import { useSelector } from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault';

const ProfileCard = props => {

  const { username: loggedInUsername } = useSelector((store) => {
    return {
      username: store.username
    }
  }) //state'i aldık

  const routeParams = useParams(); //route işlemleri
  const { user } = props;
  const { username, displayName, image } = user;


  const pathUsername = routeParams.username; //hooks ile ulaştık
  let message = 'We cannot edit';
  if (pathUsername === loggedInUsername) {
    message = 'We can edit';
  }



  return (
    <div className='card text-center'>
      <div className='card-header'>
        <ProfileImageWithDefault
          className="rounded-circle shadow"
          width='86'
          height='86'
          alt={`${username} profile`}
          image={image} />
      </div>
      <div className='card-body'>
        <h3>
          {displayName}@{username}
        </h3>
      </div>
    </div>
  )
};










/*
class ProfileCardContextWrapper extends React.Component {
  static contextType = Authentication;
  render() {
    return <ProfileCard {...this.props} username={this.context.state.username} />;
  }
}
*/

//const ProfileCardWithRouter = withRouter(ProfileCard) useParams kullanacağımız için comment out
/*
const mapStateToProps = store => {
  return {
    loggedInUsername: store.username
  }
}
*/
export default ProfileCard;
