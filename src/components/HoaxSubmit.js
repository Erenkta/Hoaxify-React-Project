import React from 'react';
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { postHoax } from '../api/apiCalls';
import { useApiProgress } from '../shared/ApiProgress';
import ButtonWithProgress from './ButtonWithProgress';

const HoaxSubmit = () => {
    const { image } = useSelector((store) => {
        return {
            image: store.image
        }
    })
    const [focused, setFocused] = useState(false)
    const [hoax, setHoax] = useState(' ')
    const [errors, setErrors] = useState({})



    const { t } = useTranslation();
    useEffect(() => {
        if (!focused) {
            setHoax('')
            setErrors({})
        }
    }, [focused])
    useEffect(() => {
        setErrors((previousError) => {
            return {
                ...previousError,
                content: undefined
            }
        })
    }, [hoax])


    const onClickSubmit = async () => {
        const body = {
            content: hoax
        }
        try {
            await postHoax(body)
            setFocused(false)

        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors) //Maksat kendi state'imizde güncelledik
            }
        }
    }
    let textAreaClass = 'form-control'
    if (errors.content) {
        textAreaClass += ' is-invalid'
    }

    const pendingApiCall = useApiProgress('post', '/api/1.0/hoaxes')
    return (
        <div className='card p-1 flex-row'>
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle mr-2" />
            <div className='flex-fill'>
                <textarea
                    placeholder='Hoax Here Now!'
                    className={textAreaClass}
                    rows={focused ? "3" : "1"}
                    onFocus={() => { setFocused(true) }}
                    onChange={(event) => { setHoax(event.target.value) }}
                    value={hoax} />
                <div className='invalid-feedback'>{errors.content}</div>
                {focused && <div className='text-right mt-1'>
                    <ButtonWithProgress
                        text={'Hoaxify'}
                        className='btn btn-primary'
                        onClick={onClickSubmit}
                        pendingApiCall={pendingApiCall}
                        disabled={pendingApiCall}
                    />
                    <button className='btn btn-light  d-inline-flex'
                        onClick={() => { setFocused(false) }}
                        disabled={pendingApiCall}>
                        <i className='material-icons'>close</i>{t('Cancel')}
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default HoaxSubmit;