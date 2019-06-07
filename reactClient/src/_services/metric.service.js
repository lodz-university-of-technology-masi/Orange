import config from 'config';
import {authHeader, handleResponse} from '@/_helpers';

export const metricService = {
    add,
};

function add(obj){
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
        }),
        body: JSON.stringify(obj)
    };
    return fetch(`${config.apiUrl}/metric`, requestOptions)
    .then(handleResponse);
}