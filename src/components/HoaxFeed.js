import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getHoaxes, getNewHoaxCount, getNewHoaxes, getOldHoaxes } from '../api/apiCalls'
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
    const [newHoaxCount, setNewHoaxCount] = useState(0);

    let lastHoaxId = 0
    let firstHoaxId = 0
    if (hoaxPage.content.length > 0) {
        firstHoaxId = hoaxPage.content[0].id

        const lastHoaxIndex = hoaxPage.content.length - 1;
        lastHoaxId = hoaxPage.content[lastHoaxIndex].id
    }

    const path = username ? `/api/1.0/users/${username}/hoaxes/?currentPage=` : `/api/1.0/hoaxes/?currentPage=`
    const initialHoaxLoadProgress = useApiProgress('get', path)//bunu en üstte olması önemli

    const oldHoaxPath = username ? `/api/1.0/${username}/hoaxes/${lastHoaxId}` : `/api/1.0/hoaxes/${lastHoaxId}`
    const loadOldHoaxesProgress = useApiProgress('get', oldHoaxPath, true)

    const newHoaxPath = username ? `/api/1.0/users/${username}/hoaxes/${firstHoaxId}?direction=after` : `/api/1.0/hoaxes/${firstHoaxId}?direction=after`
    const loadNewHoaxesProgress = useApiProgress('get', newHoaxPath, true)

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

    useEffect(() => {
        const getCount = async () => {
            const response = await getNewHoaxCount(firstHoaxId, username);
            setNewHoaxCount(response.data.count)
        } // Sürekli olarak bir işlem yaptırdık ve aynı işlem birden fazla kez çağrılmaya çalışırsa temizlensin tekrar atmasın diye cleanup yaptık
        let looper = setInterval(getCount, 5000)
        return function cleanup() {
            clearInterval(looper)
        }

    }, [firstHoaxId, username])

    const loadOldHoaxes = async () => {

        const response = await getOldHoaxes(lastHoaxId, username)

        setHoaxPage(previousHoaxesPage => ({
            ...response.data,
            content: [...previousHoaxesPage.content, ...response.data.content]

        })) //response.data bize JSON objesini verir

    }
    const loadNewHoaxes = async () => {
        const response = await getNewHoaxes(firstHoaxId, username)
        setHoaxPage(previousHoaxesPage => (
            {
                ...previousHoaxesPage,
                content: [...response.data, ...previousHoaxesPage.content]
            }
        ))
        setNewHoaxCount(0)
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
            {newHoaxCount > 0 && (
                <div className='alert alert-secondary text-center mt-2'
                    style={{ cursor: loadOldHoaxesProgress ? 'not-allowed' : 'pointer' }}
                    onClick={loadOldHoaxesProgress ? () => { } : loadNewHoaxes}>
                    {loadNewHoaxesProgress ? <Spinner /> : t('There are new hoaxes')}
                </div>)}
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