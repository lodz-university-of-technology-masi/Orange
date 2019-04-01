import config from 'config';
import {authHeader, handleResponse} from '@/_helpers';

export const editorService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/account?permissionName=EDITOR`, requestOptions).then(handleResponse);
}

