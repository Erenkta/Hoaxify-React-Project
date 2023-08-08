import React from 'react';
import { useSelector } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { postHoax } from '../api/apiCalls';

const HoaxSubmit = () => {
    const { image } = useSelector((store) => {
        return {
            image: store.image
        }
    })
    const [focused, setFocused] = useState(false)
    const [hoax, setHoax] = useState(' ')
    const { t } = useTranslation();
    useEffect(() => {
        if (!focused) {
            setHoax(' ')
        }
    }, [focused])


    const onClickSubmit = async () => {
        const body = {
            content: hoax
        }
        try {
            await postHoax(body)
        } catch (error) { }
    }
    return (
        <div className='card p-1 flex-row'>
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle mr-2" />
            <div className='flex-fill'>
                <textarea
                    className='form-control '
                    rows={focused ? "3" : "1"}
                    onFocus={() => { setFocused(true) }}
                    onChange={(event) => { setHoax(event.target.value) }}
                    value={hoax} />
                {focused && <div className='text-right mt-1'>
                    <button className='btn btn-primary' onClick={onClickSubmit}>Hoaxify</button>
                    <button className='btn btn-light  d-inline-flex'
                        onClick={() => { setFocused(false) }}>
                        <i className='material-icons'>close</i>{t('Cancel')}
                    </button>
                </div>}
            </div>
        </div>
    );
};

export default HoaxSubmit;