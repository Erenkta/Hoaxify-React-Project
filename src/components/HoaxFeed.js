import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getHoaxes } from '../api/apiCalls'
import { useTranslation } from 'react-i18next';
import HoaxView from './HoaxView';
import { useApiProgress } from '../shared/ApiProgress'
import Spinner from './Spinner';

const HoaxFeed = () => {

    const [hoaxPage, setHoaxPage] = useState({
        content: [],
        last: true,
        number: 0,
    })

    const pendingApiCall = useApiProgress('get', '/api/1.0/hoaxes')//bunu en üstte olması önemli

    useEffect(() => {
        loadHoaxes()
    }, []) //sadece mount anında çalış


    const loadHoaxes = async (page) => {
        try {
            const response = await getHoaxes(page)
            setHoaxPage(previousHoaxes => ({
                ...response.data,
                content: [...previousHoaxes.content, ...response.data.content]

            })) //response.data bize JSON objesini verir
        } catch (error) { }
    }
    const scaleDown = async (page) => {
        try {
            const response = await getHoaxes(page)
            setHoaxPage(response.data)
        } catch (error) { }
    }

    const { t } = useTranslation();
    const { content, last, number } = hoaxPage
    if (hoaxPage.content.length === 0) {
        return <div className='alert alert-secondary text-center mt-2'>{pendingApiCall ? <Spinner /> : t('There are no hoaxes')}</div>
    }

    return (
        <div>
            {content.map(hoax => {
                return <HoaxView key={hoax.id} hoax={hoax} />
            })}
            {!last && (
                <div className='alert alert-secondary text-center mt-2'
                    style={{ cursor: pendingApiCall ? 'not-allowed' : 'pointer' }}
                    onClick={pendingApiCall ? () => { } : () => loadHoaxes(number + 1)}> {/*birden fazla tıklanabilmeyi engellemek*/}
                    {pendingApiCall ? <Spinner /> : t('Load old hoaxes')}
                </div>)}
            {last && <div className='alert alert-secondary text-center mt-2' style={{ cursor: 'pointer' }} onClick={() => scaleDown(number - 1)}>{t('Scale Down')}</div>}
        </div >
    );
};

export default HoaxFeed;