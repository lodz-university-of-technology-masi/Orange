import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';
import axios from "axios";

export const testService = {
    getAll,
    get,
    getTranslated,
    remove,
    add,
    updatePosition,
    addQuestion,
    deleteQuestion,
    translate,
    generatePdf,
    importTest,
    exportTest,
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

function generatePdf(testName, targetLanguage) {
    axios({
        url: `${config.apiUrl}/test/generatePdf/${testName}/${targetLanguage}`,
        method: 'GET',
        headers: authHeader(),
        responseType: 'blob', // important
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', testName+ ".pdf");
        document.body.appendChild(link);
        link.click();
    });
}


function importTest(testName, testFile, testPosition) {
    let data = new FormData();
    data.append('file', testFile);
    data.append('name', testName);
    data.append('positionName', testPosition);
    const requestOptions = { method: 'POST', headers: authHeader(), body: data };
    return fetch(`${config.apiUrl}/test/import`, requestOptions)
        .then(handleResponse);
}

function exportTest(testName, languageName) {
    axios({
        url: `${config.apiUrl}/test/export/${testName}/${languageName}`,
        method: 'GET',
        headers: authHeader(),
        responseType: 'blob', // important
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', testName+ ".csv");
        document.body.appendChild(link);
        link.click();
    });
}
