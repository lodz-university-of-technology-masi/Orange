import config from 'config';
import {authHeader, handleResponse} from '@/_helpers';

export const editorService = {
    getAll,
    create
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account?permissionName=EDITOR`, requestOptions).then(handleResponse);
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