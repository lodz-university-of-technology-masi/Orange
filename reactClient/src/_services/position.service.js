import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const positionService = {
    getAll,
    getById,
    addPosition,
    togglePosition
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/position`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/position/${id}`, requestOptions).then(handleResponse);
}

function addPosition(name, isActive){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, isActive})
    };
    return fetch(`${config.apiUrl}/position`, requestOptions)
    .then(handleResponse);

}

function togglePosition(name){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name})
    };
    return fetch(`${config.apiUrl}/position`, requestOptions)
    .then(handleResponse);
}
