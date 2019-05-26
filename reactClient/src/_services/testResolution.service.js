import config from 'config';
import { handleResponse } from '@/_helpers';

export const testResolutionService = {
    add
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

