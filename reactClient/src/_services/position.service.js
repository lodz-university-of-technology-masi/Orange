import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const positionService = {
    getAll,
    getById,
    add,
    toggle,
    remove
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/position/list`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/position/${id}`, requestOptions).then(handleResponse);
}

function add(positionObj){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(positionObj)
    };
    return fetch(`${config.apiUrl}/position/create`, requestOptions)
    .then(handleResponse);
}

function toggle(name, isActive){
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/position/${name}?active=${!isActive}`, requestOptions)
    .then(handleResponse);
}

function remove(name){
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/position/${name}`, requestOptions).then(handleResponse);
}