import config from 'config';
import { handleResponse } from '@/_helpers';

export const questionTranslationService = {
    add,
};

function add(obj){
    const requestOptions = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('Token'),
        }),
        body: JSON.stringify(obj)
    };
    return fetch(`${config.apiUrl}/questionTranslation`, requestOptions)
    .then(handleResponse);
}
