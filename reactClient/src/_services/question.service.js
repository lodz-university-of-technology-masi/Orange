import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const questionService = {
    getAll,
    getAllTypes,
    get,
    remove,
    add,
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/question/list`, requestOptions).then(handleResponse);
}

function get(name) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/question/${name}`, requestOptions).then(handleResponse);
}

function getAllTypes() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/question/listQuestionType`, requestOptions).then(handleResponse);
}


function remove(name){
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/question/${name}`, requestOptions).then(handleResponse);
}

function add(obj){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    };
    return fetch(`${config.apiUrl}/question`, requestOptions)
    .then(handleResponse);
}
