import React from 'react';
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { deleteHoax } from '../api/apiCalls';
import Modal from './Modal';
import { useState } from 'react';
import { useApiProgress } from '../shared/ApiProgress'

const HoaxView = (props) => {
    const loggedInUser = useSelector(store => store.username)
    const { hoax, onDeleteHoax } = props
    const { user, content, timestamp, fileAttachment, id } = hoax
    const { username, displayName, image } = user
    const { i18n } = useTranslation() // dili aldık
    const formatted = format(timestamp, i18n.language) //burda da dili verdik
    const [modalVisible, setModalVisible] = useState(false)
    const { t } = useTranslation()

    const ownedByLoggedInUser = loggedInUser === username
    const deleteProgress = useApiProgress('delete', `/api/1.0/hoaxes/${id}`, true)

    const onClickDelete = async () => {
        try {
            await deleteHoax(id)
            onDeleteHoax(id)
        }
        catch (error) {

        }
    }
    const onClickCancel = () => {
        setModalVisible(false)
    }

    return (
        <>
            <div className='card p-1'>
                <div className='d-flex'>
                    <ProfileImageWithDefault image={image} width='32' height='32' className='rounded-circle mr-2' />
                    <div className='flex-fill m-auto pl-2'>
                        <Link to={`/user/${username}`} className="text-dark">
                            <h6 >
                                {displayName} @ {username}
                            </h6>
                            <span>{formatted}</span>
                        </Link>
                    </div>
                    {ownedByLoggedInUser &&
                        (<button className='btn btn-delete-link' onClick={() => setModalVisible(true)}>
                            <i className='material-icons'>delete_outline</i>
                        </button>)}
                </div>
                <div className='pl-5'>
                    {content}
                </div>
                {fileAttachment && (
                    <div className='pl-5'>
                        {fileAttachment.fileType.startsWith("image") &&
                            <img className="img-fluid" src={'images/attachments/' + fileAttachment.name} alt={content} />
                        }
                    </div>
                )}
            </div>
            <Modal
                visible={modalVisible}
                onClickCancel={onClickCancel}
                message={
                    <div>
                        <div> <strong> {t('Are you sure to delete hoax ?')}  </strong></div>
                        <span>{content}</span>
                    </div>
                }
                onClickOkey={onClickDelete}
                pendingApiCall={deleteProgress}
                title={t('Delete Hoax')}
            />
        </>
    );
};

export default HoaxView;