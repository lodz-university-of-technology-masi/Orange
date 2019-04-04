import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const testService = {
    getAll,
    getById,
    remove,
    add,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/list`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${id}`, requestOptions).then(handleResponse);
}

function remove(id){
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${id}`, requestOptions).then(handleResponse);
}

function add(testObj){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/test/create`, requestOptions)
    .then(handleResponse);
}