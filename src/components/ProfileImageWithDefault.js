import React from 'react';
import defaultPicture from '../assets/profile.png'

const ProfileImageWithDefault = (props) => {
    const { image } = props
    let imageSource = defaultPicture
    if (image) {
        imageSource = image
    } //eğer fotosu varsa onu koy yoksa bunu koy

    return (
        <img alt={`Profile`} src={imageSource} {...props} /> /* isteğe bağlı olan mesela width height gibi onları {...props ile verdik}*/
    );
};

export default ProfileImageWithDefault;


