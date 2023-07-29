import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

const ProfileCard = (props) => {
    const pathUsername = props.match.params.username;
    const currentUser = props.username

    let message = "We cannot edit"
    if (pathUsername === currentUser) {
        message = "We can edit"
    }
    return (
        <div>
            <div>
                {message}
            </div>
        </div>

    );
}

export default withRouter(ProfileCard); //Bunu kullandık bu sayede ProfileCard'ı kullanan Page'lerin propslarını da buraya aldık