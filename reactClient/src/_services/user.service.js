import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getByUsername,
    createCandidateAccount,
    updateAccount,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getByUsername(username) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account/${username}`, requestOptions).then(handleResponse);
}

function createCandidateAccount(username, password, firstName, lastName, preferredLanguageName) {

    const permissionName = 'CANDIDATE';

    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            // 'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify({ username, password, permissionName, firstName, lastName, preferredLanguageName })

    };
    return fetch(`${config.apiUrl}/account/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}


function updateAccount(username, permissionName, firstName, lastName, preferredLanguageName) {

    const requestOptions = {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify({ username, permissionName, firstName, lastName, preferredLanguageName })

    };
    return fetch(`${config.apiUrl}/account/update`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}
