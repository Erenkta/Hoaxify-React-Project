import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getHoaxes, getOldHoaxes } from '../api/apiCalls'
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom'
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress'
import Spinner from './Spinner';

const HoaxFeed = () => {

    const [hoaxPage, setHoaxPage] = useState({
        content: [],
        last: true,
        number: 0,
    })
    const { username } = useParams()

    let lastHoaxId = 0
    if (hoaxPage.content.length > 0) {
        const lastHoaxIndex = hoaxPage.content.length - 1;
        lastHoaxId = hoaxPage.content[lastHoaxIndex].id
    }

    const path = username ? `/api/1.0/users/${username}/hoaxes/?currentPage=` : `/api/1.0/hoaxes/?currentPage=`
    const initialHoaxLoadProgress = useApiProgress('get', path)//bunu en üstte olması önemli

    const oldHoaxPath = username ? `/api/1.0/${username}/hoaxes/${lastHoaxId}` : `/api/1.0/hoaxes/${lastHoaxId}`
    const loadOldHoaxesProgress = useApiProgress('get', oldHoaxPath, true)

    useEffect(() => {
        const loadHoaxes = async (page) => {
            try {
                const response = await getHoaxes(username, page)
                setHoaxPage(previousHoaxes => ({
                    ...response.data,
                    content: [...previousHoaxes.content, ...response.data.content]

                })) //response.data bize JSON objesini verir
            } catch (error) { }
        }
        loadHoaxes()
    }, [username]) //sadece mount anında çalış

    const loadOldHoaxes = async () => {

        const response = await getOldHoaxes(lastHoaxId, username)

        setHoaxPage(previousHoaxes => ({
            ...response.data,
            content: [...previousHoaxes.content, ...response.data.content]

        })) //response.data bize JSON objesini verir

    }


    /*const scaleDown = async (page) => {
        try {
            const response = await getHoaxes(page)
            setHoaxPage(response.data)
        } catch (error) { }
    }*/

    const { t } = useTranslation();
    const { content, last } = hoaxPage
    if (hoaxPage.content.length === 0) {
        return <div className='alert alert-secondary text-center mt-2'>{initialHoaxLoadProgress ? <Spinner /> : t('There are no hoaxes')}</div>
    }

    return (
        <div>
            {content.map(hoax => {
                return <HoaxView key={hoax.id} hoax={hoax} />
            })}
            {!last && (
                <div className='alert alert-secondary text-center mt-2'
                    style={{ cursor: loadOldHoaxesProgress ? 'not-allowed' : 'pointer' }}
                    onClick={loadOldHoaxesProgress ? () => { } : () => loadOldHoaxes()}> {/*birden fazla tıklanabilmeyi engellemek*/}
                    {loadOldHoaxesProgress ? <Spinner /> : t('Load old hoaxes')}
                </div>)}
            {/*{last && hoaxPage.length > 1 && <div className='alert alert-secondary text-center mt-2' style={{ cursor: 'pointer' }} onClick={() => scaleDown(number - 1)}>{t('Scale Down')}</div>} */}
        </div >
    );
};

export default HoaxFeed;