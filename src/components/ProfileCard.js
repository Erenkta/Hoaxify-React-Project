import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
//import { Authentication } from '../shared/AuthenticationContext';
import { useSelector } from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input'
import { useEffect } from 'react';
import { updateUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress'

const ProfileCard = props => {

  const { username: loggedInUsername } = useSelector((store) => {
    return {
      username: store.username
    }
  }) //state'i aldık

  const [inEditMode, setInEditMode] = useState(false)
  const [updatedDisplayName, setUpdatedDisplayName] = useState()
  const [editable, setEditable] = useState(false)
  const [newImage, setNewImage] = useState()

  const routeParams = useParams(); //route işlemleri

  const pathUsername = routeParams.username

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername)
  }, [pathUsername, loggedInUsername])


  const [user, setUser] = useState({})
  //const { user } = props;
  const { username, displayName, image } = user;
  const { t } = useTranslation()

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined)
      setNewImage(undefined)
    } else {
      setUpdatedDisplayName(displayName)
    }
  }, [inEditMode, displayName])


  const onClickSave = async () => {
    let image;
    if (newImage) { //Eğer image seçmeden save edersek diye
      image = newImage.split(",")[1]
    }

    const body = {
      displayName: updatedDisplayName,
      image
    };
    try {
      const response = await updateUser(username, body)
      setInEditMode(false)
      setUser(response.data)
    } catch (error) { }
  };

  const onChangeFile = event => {
    const file = event.target.files[0] //Tekli foto seçimi olduğu için böyle
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      setNewImage(fileReader.result)
    }
    if (event.target.files.length < 1) {
      return;
    }
    fileReader.readAsDataURL(file)
  }

  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + username);


  return (
    <div className='card text-center'>
      <div className='card-header'>
        <ProfileImageWithDefault
          className="rounded-circle shadow"
          width='86'
          height='86'
          alt={`${username} profile`}
          image={image} tempimage={newImage} />
      </div>
      <div className='card-body'>
        {!inEditMode &&
          <>
            <h3>
              {displayName}@{username}
            </h3>
            {editable && <button className='btn btn-success d-inline-flex' onClick={() => setInEditMode(true)}>
              <i className='material-icons'>edit</i>
              {t('Edit')}
            </button>}
          </>
        }
        {inEditMode && (
          <div>
            <Input label={t('Change Display Name')} defaultValue={displayName} onChange={(event) => {
              setUpdatedDisplayName(event.target.value)
            }} />
            <input type="file" onChange={onChangeFile} />
            <div>
              <ButtonWithProgress
                className='btn btn-primary  d-inline-flex'
                onClick={onClickSave}
                disabled={pendingApiCall}
                pendingApiCall={pendingApiCall}
                text={
                  <>
                    <i className='material-icons'>save</i>{t('Save')}
                  </>
                }
              />
              <button className='btn btn-light  d-inline-flex'
                onClick={() => { setInEditMode(false); }}
                disabled={pendingApiCall}>
                <i className='material-icons'>close</i>{t('Cancel')}
              </button>

            </div>
          </div>
        )}
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
