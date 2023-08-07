import React from 'react';
import defaultPicture from '../assets/profile.png'

const ProfileImageWithDefault = (props) => {
    const { image, tempimage } = props

    let imageSource = defaultPicture
    if (image) {
        imageSource = "/images/" + image //http://localhost:8080/images/profile.png şeklinde request atmamıza yaradı 
    } //eğer fotosu varsa onu koy yoksa bunu koy

    return (
        <img
            alt={`Profile`}
            src={tempimage || imageSource} {...props} /* isteğe bağlı olan mesela width height gibi onları {...props ile verdik}*/
            onError={(event) => {
                event.target.src = defaultPicture /* eğer bi sebepten hata olursa diye*/
            }}
        />

    );
};

export default ProfileImageWithDefault;


