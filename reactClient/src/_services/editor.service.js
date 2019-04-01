import config from 'config';
import {authHeader, handleResponse} from '@/_helpers';

export const editorService = {
    getAll,
    getByUsername,
    create,
    update,
    remove
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account?permissionName=EDITOR`, requestOptions).then(handleResponse);
}

function getByUsername(username) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account/${username}`, requestOptions).then(handleResponse);
}

function create(username, password, firstName, lastName) {

    const permissionName = 'EDITOR';

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, permissionName, firstName, lastName })
    };

    return fetch(`${config.apiUrl}/account/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function update(username, firstName, lastName) {

    const permissionName = 'EDITOR';

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, permissionName, firstName, lastName })
    };

    return fetch(`${config.apiUrl}/account/update`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function remove(username) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/account/delete/${username}`, requestOptions)
        .then(handleResponse)
}