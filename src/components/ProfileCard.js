import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
//import { Authentication } from '../shared/AuthenticationContext';
import { useSelector, useDispatch } from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useTranslation } from 'react-i18next';
import Input from './Input'
import { useEffect } from 'react';
import { deleteUser, updateUser } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress'
import { logoutSuccess, updateSuccess } from '../redux/authActions';
import Modal from './Modal';

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
  const [errors, setErrors] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const routeParams = useParams(); //route işlemleri
  const pathUsername = routeParams.username
  const dispatch = useDispatch();
  const history = useHistory()

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername)
  }, [pathUsername, loggedInUsername])



  const [user, setUser] = useState({})
  //const { user } = props;
  const { username, displayName, image } = user;
  const { t } = useTranslation()
  const pendingDelete = useApiProgress('delete', `/api/1.0/users/${username}`)

  /* Benim yaptığım
  useEffect(() => {
    errors.displayName = undefined
  }, [errors, updatedDisplayName])
*/

  useEffect(() => {
    setErrors((previousErrors) => { //Bu bir fonksiyon ve bize object'in son halini veriyor biz de o son hali kullanıp sadece istediğimiz parametreleri değiştiriyoruz
      return {
        ...previousErrors,
        displayName: undefined,
      }
    })
  }, [updatedDisplayName])

  useEffect(() => {
    setErrors((previousError) => {
      return {
        ...previousError,
        image: undefined
      }
    })
  }, [newImage])

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
      dispatch(updateSuccess(response.data))
    } catch (error) {
      setErrors(error.response.data.validationErrors)
    }
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
  const onClickDelete = async () => {
    try {
      await deleteUser(username)
      setModalVisible(false)
      dispatch(logoutSuccess())
      history.push('/')
    }
    catch (error) {

    }
  }
  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + username);

  const { displayName: displayNameError, image: imageError } = errors
  return (
    <>
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
              {editable &&
                <>
                  <button className='btn btn-success d-inline-flex' onClick={() => setInEditMode(true)}>
                    <i className='material-icons'>edit</i>
                    {t('Edit')}
                  </button>
                  <div className='pt-2'>
                    <button className='btn btn-danger d-inline-flex ' onClick={() => { setModalVisible(true) }}>
                      <i className='material-icons'>delete</i>
                      {t('Delete My Account')}
                    </button>
                  </div>

                </>
              }

            </>
          }
          {inEditMode && (
            <div>
              <Input
                label={t('Change Display Name')}
                defaultValue={displayName}
                onChange={(event) => {
                  setUpdatedDisplayName(event.target.value)
                }}
                error={displayNameError}
              />
              <Input type="file" onChange={onChangeFile} error={imageError} />
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
      <Modal
        visible={modalVisible}
        message={'Are you sure to delete your account ? '}
        onClickOkey={onClickDelete}
        onClickCancel={() => { setModalVisible(false) }}
        title={t('Delete User')}
        pendingApiCall={pendingDelete}
      />
    </>

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
