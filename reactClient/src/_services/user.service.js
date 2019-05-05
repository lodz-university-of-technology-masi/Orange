import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll,
    getByUsername,
    createCandidateAccount
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/users`, requestOptions).then(handleResponse);
}

function getByUsername(username) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account/${username}`, requestOptions).then(handleResponse);
}

function createCandidateAccount(username, password, firstName, lastName) {

    const permissionName = 'CANDIDATE';

    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            // 'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify({ username, password, permissionName, firstName, lastName })

    };
    console.log(requestOptions);
    return fetch(`${config.apiUrl}/account/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}