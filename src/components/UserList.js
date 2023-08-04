import React from 'react';
import { getUsers } from '../api/apiCalls';
import { useTranslation } from 'react-i18next';
import UserListItem from './UserListItem';
import { useState } from 'react';
import { useEffect } from 'react';
import { useApiProgress } from '../shared/ApiProgress';
import Spinner from './Spinner';

const UserList = () => {
    const [page, setPage] = useState({
        content: [],
        number: 0,
        size: 3
    })
    const [loadFailure, setLoadFailure] = useState(false)

    const pendingApiCall = useApiProgress('/api/1.0/users?currentPage')
    useEffect(() => {
        loadUsers()
    }, []) // Buradaki anlam şu . ComponentDidMount Çağrıldı. Daha sonrasında ise hiçbir şeye göre güncellemedik yani sadece çağpırdık ve bıraktık

    const loadUsers = async page => {
        setLoadFailure(false)
        try {
            const response = await getUsers(page)
            setPage(response.data
            )
        } catch (error) {
            setLoadFailure(true)
        }
    }

    const onClickNext = () => {
        const nextPage = page.number + 1
        loadUsers(nextPage)
    }
    const onClickPrev = () => {
        const prevPage = page.number - 1
        loadUsers(prevPage)
    }

    const { content: users, last, first } = page
    const { t } = useTranslation()

    let actionDiv = (
        <div>
            {first === false && <button className='btn btn-sm btn-light ' onClick={onClickPrev}>
                Previous
            </button>}
            {last === false && <button className='btn btn-sm btn-light float-right' onClick={onClickNext}>{/* eğer biz sadece !last yazsaydık undefined durumda bile false olucaktı ondan direkt === diye kontrol etmemiz daha iyi olur*/}
                Next
            </button>}
        </div>
    )

    if (pendingApiCall) {
        actionDiv = (
            <Spinner />
        )
    }
    return (
        <div className='card'>
            <h3 className='card-header text-center'>{t('Users')}</h3>
            <div className='list-group-flush'>
                {users.map((user) => (
                    <UserListItem key={user.username} user={user} />
                ))}
            </div>
            {actionDiv}
            {loadFailure && <div className='text-center text-danger'>{t('Load Failure')}</div>}
        </div>);
}


export default UserList;