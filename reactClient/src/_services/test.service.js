import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const testService = {
    getAll,
    get,
    getTranslated,
    remove,
    add,
    updatePosition,
    addQuestion,
    deleteQuestion,
    translate
};

function getAll(positionName) {
    if (positionName) {
        positionName = `?positionName=${positionName}`;
    } else {
        positionName = '';
    }
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/list${positionName}`, requestOptions).then(handleResponse);
}

function get(name) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/${name}`, requestOptions).then(handleResponse);
}

function getTranslated(name, preferredLanguageName) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/translated/${name}?preferredLanguageName=${preferredLanguageName}`,
        requestOptions).then(handleResponse);
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

function updatePosition(testObj){
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token')
        },
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/test/updatePosition`, requestOptions)
    .then(handleResponse);
}

function translate(testName, targetLanguage) {
    const requestOptions = { method: 'PUT', headers: authHeader() };
    return fetch(`${config.apiUrl}/test/translate/${testName}/${targetLanguage}`, requestOptions)
        .then(handleResponse);
}
