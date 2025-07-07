import React, { useState } from 'react';

import UserRegistration from './UserRegistration';
import UserDeletion from './UserDeletion';
import ClientRegistration from './ClientRegistration';
import UserManagementViewComponentEnum from '../types/Enums';

interface UserManagementViewProps {
    endpoint: string,
    token: string,
}

const UserManagementView: React.FC<UserManagementViewProps> = (props: UserManagementViewProps) => {

    const [ userRegistrationOpen, setUserRegistrationOpen ] = useState(false);
    const [ userDeletionOpen, setUserDeletionOpen ] = useState(false);
    const [ clientRegistrationOpen, setClientRegistrationOpen ] = useState(false);

    const openFormCallback: (component: UserManagementViewComponentEnum) => void = (component: UserManagementViewComponentEnum) => {
        switch (component) {
        case UserManagementViewComponentEnum.USER_REGISTRATION:
            setUserRegistrationOpen(true);
            setUserDeletionOpen(false);
            setClientRegistrationOpen(false);
            break;
        case UserManagementViewComponentEnum.USER_DELETION:
            setUserRegistrationOpen(false);
            setUserDeletionOpen(true);
            setClientRegistrationOpen(false);
            break;
        case UserManagementViewComponentEnum.CLIENT_REGISTRATION:
            setUserRegistrationOpen(false);
            setUserDeletionOpen(false);
            setClientRegistrationOpen(true);
            break;
        default:
            console.log("Unhandled UserManagementViewComponentEnum");
            break;
        }
    };

    const closeFormCallback: ( component: UserManagementViewComponentEnum ) => void = (component: UserManagementViewComponentEnum) => {
        switch (component) {
        case UserManagementViewComponentEnum.USER_REGISTRATION:
            setUserRegistrationOpen(false);
            break;
        case UserManagementViewComponentEnum.USER_DELETION:
            setUserDeletionOpen(false);
            break;
        case UserManagementViewComponentEnum.CLIENT_REGISTRATION:
            setClientRegistrationOpen(false);
            break;
        default:
            console.log("Unhandled UserManagementViewComponentEnum");
            break;
        }
    }

    // TODO: Make the 'cancel' buttons on these child components work again or get rid of them 
    return (
        <>
            <UserRegistration endpoint={props.endpoint} token={props.token} openFormCallback={ openFormCallback } closeFormCallback={ closeFormCallback } renderOpen={ userRegistrationOpen }/>
            <UserDeletion endpoint={props.endpoint} token={props.token} openFormCallback={ openFormCallback } closeFormCallback={ closeFormCallback } renderOpen={ userDeletionOpen }/>
            <ClientRegistration endpoint={props.endpoint} token={props.token} openFormCallback={ openFormCallback } closeFormCallback={ closeFormCallback } renderOpen={ clientRegistrationOpen }/>
        </>
    );
}

export default UserManagementView;