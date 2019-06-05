import config from 'config';
import { handleResponse, authHeader } from '@/_helpers';

export const testResolutionService = {
    add,
    getAllResolvedTests,
    getTestResolutionById,
    getAllResolvedTestsByTestName
};

function add(testObj){
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify(testObj)
    };
    return fetch(`${config.apiUrl}/testResolution/create`, requestOptions)
    .then(handleResponse);
}

function getAllResolvedTests(){
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/testResolution/list`, requestOptions).then(handleResponse);
}


function getAllResolvedTestsByTestName(testName){
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/testResolution/list/test/${testName}`, requestOptions).then(handleResponse);
}

function getTestResolutionById(id) {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/testResolution/list/${id}`, requestOptions).then(handleResponse);
}

