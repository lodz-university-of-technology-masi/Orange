import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const testService = {
    getAll,
    getById,
    remove,
    add,
    attachPosition
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/list`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${id}`, requestOptions).then(handleResponse);
}

function remove(name){
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${name}`, requestOptions).then(handleResponse);
}

function add(testObj){
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/test`, requestOptions)
    .then(handleResponse);
}

function attachPosition(testName, positonName){
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/attach/${testName}?position=${positonName}`, requestOptions)
    .then(handleResponse);
}
