import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const testService = {
    getAll,
    get,
    remove,
    add,
    updatePosition,
    addQuestion,
    deleteQuestion,
    updateName
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/list`, requestOptions).then(handleResponse);
}

function get(name) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${name}`, requestOptions).then(handleResponse);
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

function addQuestion(testName, questionName){
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${testName}/${questionName}`, requestOptions)
    .then(handleResponse);
}

function deleteQuestion(testName, questionName){
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${testName}/${questionName}`, requestOptions)
    .then(handleResponse);
}

function updateName(oldName,testObj){
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/test/updateName/${oldName}`, requestOptions)
    .then(handleResponse);
}

function updatePosition(testObj){
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/test/updatePosition`, requestOptions)
    .then(handleResponse);
}