import React from 'react';
import defaultPicture from '../assets/profile.png'
import { Link } from 'react-router-dom';

const UserListItem = (props) => {
    const { user } = props
    const { username, displayName, image } = user
    let imageSource = defaultPicture
    if (image) {
        imageSource = image
    } //eğer fotosu varsa onu koy yoksa bunu koy

    return (
        <Link to={`/user/${username}`} className='list-group-item list-group-item-action' >
            <img className='rounded-circle' width="32" height="32" alt={`${username} profile  `} src={imageSource}></img>
            <span className='pl-3'></span>
            {displayName}@{username}
        </Link >
    );
};

export default UserListItem;