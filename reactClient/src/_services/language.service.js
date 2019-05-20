import config from 'config';
import {authHeader, handleResponse} from '@/_helpers';

export const languageService = {
    getAll,
    create,
    remove
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/language`, requestOptions).then(handleResponse);
}

function create(name) {

    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify({ name })
    };

    return fetch(`${config.apiUrl}/language/create`, requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function remove(name) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/language/delete/${name}`, requestOptions)
        .then(handleResponse)
}
