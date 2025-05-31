import React, { useState } from 'react';

import UserRegistration from './UserRegistration';
import UserDeletion from './UserDeletion';
import UserManagementViewComponentEnum from '../types/Enums';

interface UserManagementViewProps {
    endpoint: string,
    token: string,
}

const UserManagementView: React.FC<UserManagementViewProps> = (props: UserManagementViewProps) => {

    const [ userRegistrationOpen, setUserRegistrationOpen ] = useState(false);
    const [ userDeletionOpen, setUserDeletionOpen ] = useState(false);

    const openFormCallback: (component: UserManagementViewComponentEnum) => void = (component: UserManagementViewComponentEnum) => {
        switch (component) {
        case UserManagementViewComponentEnum.USER_REGISTRATION:
            console.log("reg")
            setUserRegistrationOpen(true);
            setUserDeletionOpen(false);
            break;
        case UserManagementViewComponentEnum.USER_DELETION:
            console.log("del")
            setUserRegistrationOpen(false);
            setUserDeletionOpen(true);
            break;
        default:
            console.log("Unhandled UserManagementViewComponentEnum");
            break;
        }
    };
    // TODO: Make the 'cancel' buttons on these child components work again or get rid of them 
    return (
        <>
            <UserRegistration endpoint={props.endpoint} token={props.token} openFormCallback={ openFormCallback } renderOpen={ userRegistrationOpen }/>
            <UserDeletion endpoint={props.endpoint} token={props.token} openFormCallback={ openFormCallback } renderOpen={ userDeletionOpen }/>
        </>
    );
}

export default UserManagementView;